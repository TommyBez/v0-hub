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
