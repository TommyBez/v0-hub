"use server"

import { z } from "zod"
import { v0 } from "v0-sdk"

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
  } | null
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

  try {
    const chat = await v0.chats.init({
      type: "repo",
      repo: {
        url: repoUrl,
        branch: branch,
      },
      chatPrivacy: "private",
    })

    return {
      success: true,
      message: "Chat bootstrapped successfully!",
      data: {
        id: chat.id,
        url: chat.url,
        demo: chat.demo,
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
