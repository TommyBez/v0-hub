"use server"

import { z } from "zod"
import { v0 } from "v0-sdk"
import { Dub } from "dub"

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

async function createShortLink(longUrl: string, title?: string, metadata?: Record<string, any>): Promise<string | null> {
  // Initialize Dub client
  const dub = new Dub({
    token: process.env.DUB_API_KEY,
  })

  try {
    const linkData: any = {
      url: longUrl,
      title: title || "v0 Chat",
      // Optional: add tags for organization
      tags: ["v0-chat"],
    }

    // Add custom domain if configured
    if (process.env.DUB_CUSTOM_DOMAIN) {
      linkData.domain = process.env.DUB_CUSTOM_DOMAIN
    }

    // Add metadata if provided
    if (metadata) {
      linkData.metadata = metadata
    }

    const link = await dub.links.create(linkData)

    return link.shortLink
  } catch (error) {
    console.error("Error creating short link:", error)
    // Check for specific Dub errors
    if (error instanceof Error) {
      if (error.message.includes("rate limit")) {
        console.error("Dub rate limit exceeded")
      } else if (error.message.includes("unauthorized")) {
        console.error("Invalid Dub API key")
      }
    }
    return null
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

  // The SDK automatically uses the V0_API_KEY environment variable
  if (!process.env.V0_API_KEY) {
    const message = "V0_API_KEY is not set on the server."
    console.error(message)
    return {
      success: false,
      message: "Server configuration error. Please contact support.",
    }
  }

  // Check if Dub API key is configured
  if (!process.env.DUB_API_KEY) {
    console.warn("DUB_API_KEY is not set. Short links will not be generated.")
  }

  try {
    const chat = await v0.chats.init({
      type: "repo",
      repo: {
        url: repoUrl,
        branch: branch,
      },
      chatPrivacy: "public",
    })

    // Generate short links for the chat URL and demo URL
    let shortUrl: string | undefined
    let shortDemoUrl: string | undefined

    if (process.env.DUB_API_KEY) {
      // Extract repo name from URL for better link titles
      const repoMatch = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
      const repoName = repoMatch ? `${repoMatch[1]}/${repoMatch[2]}` : "Repository"
      
      // Metadata to track the source
      const metadata = {
        repository: repoUrl,
        branch: branch,
        chatId: chat.id,
        createdAt: new Date().toISOString()
      }
      
      // Create short links with metadata
      const shortUrlResult = await createShortLink(
        chat.url, 
        `v0 Chat - ${repoName} (${branch})`,
        { ...metadata, type: "chat" }
      )
      const shortDemoUrlResult = await createShortLink(
        chat.demo, 
        `v0 Demo - ${repoName} (${branch})`,
        { ...metadata, type: "demo" }
      )
      
      if (shortUrlResult) shortUrl = shortUrlResult
      if (shortDemoUrlResult) shortDemoUrl = shortDemoUrlResult
      
      // Log success
      if (shortUrl || shortDemoUrl) {
        console.log(`Created short links for ${repoName}:`, {
          chat: shortUrl,
          demo: shortDemoUrl
        })
      }
    }

    return {
      success: true,
      message: "Chat bootstrapped successfully!",
      data: {
        id: chat.id,
        url: chat.url,
        demo: chat.demo,
        shortUrl,
        shortDemoUrl,
      },
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
