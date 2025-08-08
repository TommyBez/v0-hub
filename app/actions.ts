"use server"

import { z } from "zod"
import { v0, createClient } from "v0-sdk"
import { Dub } from "dub"
import { 
  getCachedUser,
  updateUserV0Token,
  getDecryptedV0Token
} from "@/db/queries"

// Define the schema for input validation
const bootstrapSchema = z.object({
  repoUrl: z
    .string()
    .url()
    .regex(/^https:\/\/github\.com\/[^/]+\/[^/]+$/, {
      message: "Please enter a valid GitHub repository URL (e.g., https://github.com/user/repo).",
    }),
  branch: z.string().min(1, { message: "Branch name cannot be empty." }),
})

// Define the state for the action response
interface BootstrapState {
  success: boolean
  message: string
  data?: {
    id: string
    url: string
    demo: string
    shortUrl?: string
    shortDemoUrl?: string
  } | null
}

// Define the interface for the chat creation result
export interface ChatCreationResult {
  id: string
  url: string
  demo: string
  shortUrl?: string
  shortDemoUrl?: string
}

async function createShortLink(longUrl: string): Promise<string | null> {
  // Initialize Dub client
  const dub = new Dub({
    token: process.env.DUB_API_KEY,
  })

  try {
    const link = await dub.links.create({
      url: longUrl,
    })

    return link.shortLink
  } catch (error) {
    console.error("Error creating short link:", error)
    return null
  }
}

function generateChatName(repoUrl: string, branch: string): string {
  // Extract repository name from URL
  const match = repoUrl.match(/^https:\/\/github\.com\/[^/]+\/([^/]+)$/)
  const repoName = match ? match[1] : "repository"

  // Omit branch if it's main or master
  const shouldIncludeBranch = branch !== "main" && branch !== "master"

  return shouldIncludeBranch ? `[v0hub] ${repoName} - ${branch}` : `[v0hub] ${repoName}`
}

// Extracted core chat creation logic that can be used by both server actions and server components
export async function createV0Chat(repoUrl: string, branch: string): Promise<ChatCreationResult> {
  // The SDK automatically uses the V0_API_KEY environment variable
  if (!process.env.V0_API_KEY) {
    throw new Error("V0_API_KEY is not set on the server.")
  }

  // Check if Dub API key is configured
  if (!process.env.DUB_API_KEY) {
    console.warn("DUB_API_KEY is not set. Short links will not be generated.")
  }

  // Generate custom chat name
  const chatName = generateChatName(repoUrl, branch)

  const chat = await v0.chats.init({
    type: "repo",
    repo: {
      url: repoUrl,
      branch: branch,
    },
    chatPrivacy: "public",
    name: chatName,
  })

  // Generate short links for the chat URL and demo URL
  let shortUrl: string | undefined
  let shortDemoUrl: string | undefined

  if (process.env.DUB_API_KEY) {
    // Create short links
    const shortUrlResult = await createShortLink(chat.webUrl)
    const shortDemoUrlResult = await createShortLink(chat.latestVersion?.demoUrl || "")

    if (shortUrlResult) shortUrl = shortUrlResult
    if (shortDemoUrlResult) shortDemoUrl = shortDemoUrlResult
  }

  return {
    id: chat.id,
    url: chat.webUrl,
    demo: chat.latestVersion?.demoUrl || "",
    shortUrl,
    shortDemoUrl,
  }
}

export async function bootstrapChatFromRepo(prevState: BootstrapState, formData: FormData): Promise<BootstrapState> {
  const validatedFields = bootstrapSchema.safeParse({
    repoUrl: formData.get("repoUrl"),
    branch: formData.get("branch"),
  })

  if (!validatedFields.success) {
    const firstError = validatedFields.error.flatten().fieldErrors
    const errorMessage = firstError.repoUrl?.[0] || firstError.branch?.[0] || "Invalid input."
    return {
      success: false,
      message: errorMessage,
    }
  }

  const { repoUrl, branch } = validatedFields.data

  try {
    const chatData = await createV0Chat(repoUrl, branch)

    return {
      success: true,
      message: "Chat bootstrapped successfully!",
      data: chatData,
    }
  } catch (error) {
    console.error("Error bootstrapping chat:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
    return {
      success: false,
      message: `Failed to bootstrap chat: ${errorMessage}`,
    }
  }
}

// New action to fetch branches from GitHub
export async function fetchGitHubBranches(
  repoUrl: string,
): Promise<{ success: boolean; branches?: string[]; error?: string }> {
  try {
    // Extract owner and repo from URL
    const match = repoUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)(?:\.git)?(?:\/)?$/)
    if (!match) {
      return { success: false, error: "Invalid GitHub repository URL" }
    }

    const [, owner, repo] = match

    // Fetch branches from GitHub API
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "v0-github-bootstrapper",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: "Repository not found or is private" }
      }
      if (response.status === 403) {
        return { success: false, error: "Rate limit exceeded. Please try again later." }
      }
      return { success: false, error: `GitHub API error: ${response.status}` }
    }

    const branches = await response.json()
    const branchNames = branches.map((branch: { name: string }) => branch.name)

    return { success: true, branches: branchNames }
  } catch (error) {
    console.error("Error fetching branches:", error)
    return { success: false, error: "Failed to fetch branches" }
  }
}

// Token Management Server Actions

export async function getUserToken(): Promise<{ hasToken: boolean }> {
  const user = await getCachedUser()
  if (!user) throw new Error("Not authenticated")
  
  return { hasToken: !!user.v0token }
}

export async function saveUserToken(token: string): Promise<void> {
  const user = await getCachedUser()
  if (!user) throw new Error("Not authenticated")
  
  await updateUserV0Token(user.clerkId, token)
}

export async function deleteUserToken(): Promise<void> {
  const user = await getCachedUser()
  if (!user) throw new Error("Not authenticated")
  
  await updateUserV0Token(user.clerkId, null)
}

// Modified createV0Chat to support user tokens
export async function createV0ChatWithToken(
  repoUrl: string,
  branch: string,
  useUserToken: boolean = false
): Promise<ChatCreationResult> {
  let apiKey = process.env.V0_API_KEY
  
  // If user token is requested, use it
  if (useUserToken) {
    const user = await getCachedUser()
    if (!user) throw new Error("Not authenticated")
    
    const token = await getDecryptedV0Token(user.clerkId)
    if (!token) throw new Error("No token found. Please add your v0 API token.")
    
    apiKey = token
  } else if (!apiKey) {
    throw new Error("No API key available. Please provide a token or set V0_API_KEY.")
  }
  
  // Check if Dub API key is configured
  if (!process.env.DUB_API_KEY) {
    console.warn("DUB_API_KEY is not set. Short links will not be generated.")
  }

  // Generate custom chat name
  const chatName = generateChatName(repoUrl, branch)
  
  // Create a custom v0 client with the specific token
  const client = createClient({ apiKey: apiKey })

  const chat = await client.chats.init({
    type: "repo",
    repo: {
      url: repoUrl,
      branch: branch,
    },
    chatPrivacy: useUserToken ? "private" : "public",
    name: chatName,
  })

  // Generate short links for the chat URL and demo URL
  let shortUrl: string | undefined
  let shortDemoUrl: string | undefined

  if (process.env.DUB_API_KEY) {
    // Create short links
    const shortUrlResult = await createShortLink(chat.webUrl)
    const shortDemoUrlResult = await createShortLink(chat.latestVersion?.demoUrl || "")

    if (shortUrlResult) shortUrl = shortUrlResult
    if (shortDemoUrlResult) shortDemoUrl = shortDemoUrlResult
  }

  return {
    id: chat.id,
    url: chat.webUrl,
    demo: chat.latestVersion?.demoUrl || "",
    shortUrl,
    shortDemoUrl,
  }
}
