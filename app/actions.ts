'use server'

import { createClient, v0 } from 'v0-sdk'
import { z } from 'zod'
import {
  getCachedUser,
  getDecryptedV0Token,
  updateUserV0Token,
} from '@/db/queries'
import { logger } from '@/lib/logger'

const GITHUB_REPO_URL_REGEX = /^https:\/\/github\.com\/[^/]+\/[^/]+$/
const GITHUB_REPO_URL_REGEX_WITH_BRANCH =
  /^https:\/\/github\.com\/([^/]+)\/([^/]+)(?:\.git)?(?:\/)?$/

// Define the schema for input validation
const bootstrapSchema = z.object({
  repoUrl: z.string().url().regex(GITHUB_REPO_URL_REGEX, {
    message:
      'Please enter a valid GitHub repository URL (e.g., https://github.com/user/repo).',
  }),
  branch: z.string().min(1, { message: 'Branch name cannot be empty.' }),
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

// Define the interface for the chat creation result
export interface ChatCreationResult {
  id: string
  url: string
  demo: string
}

function generateChatName(repoUrl: string, branch: string): string {
  // Extract repository name from URL
  const match = repoUrl.match(GITHUB_REPO_URL_REGEX_WITH_BRANCH)
  const repoName = match ? match[2] : 'repository'

  // Omit branch if it's main or master
  const shouldIncludeBranch =
    branch !== 'main' && branch !== 'master' && branch !== 'main'

  return shouldIncludeBranch
    ? `[v0hub] ${repoName} - ${branch}`
    : `[v0hub] ${repoName}`
}

// Extracted core chat creation logic that can be used by both server actions and server components
export async function createV0Chat(
  repoUrl: string,
  branch: string,
): Promise<ChatCreationResult> {
  // The SDK automatically uses the V0_API_KEY environment variable
  if (!process.env.V0_API_KEY) {
    throw new Error('V0_API_KEY is not set on the server.')
  }

  // Generate custom chat name
  const chatName = generateChatName(repoUrl, branch)

  const chat = await v0.chats.init({
    type: 'repo',
    repo: {
      url: repoUrl,
      branch,
    },
    chatPrivacy: 'public',
    name: chatName,
  })

  return {
    id: chat.id,
    url: chat.webUrl,
    demo: chat.latestVersion?.demoUrl || '',
  }
}

export async function bootstrapChatFromRepo(
  _prevState: BootstrapState,
  formData: FormData,
): Promise<BootstrapState> {
  const validatedFields = bootstrapSchema.safeParse({
    repoUrl: formData.get('repoUrl'),
    branch: formData.get('branch'),
  })

  if (!validatedFields.success) {
    const firstError = validatedFields.error.flatten().fieldErrors
    const errorMessage =
      firstError.repoUrl?.[0] || firstError.branch?.[0] || 'Invalid input.'
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
      message: 'Chat bootstrapped successfully!',
      data: chatData,
    }
  } catch (error) {
    logger.error(`Error bootstrapping chat: ${error}`)
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.'
    return {
      success: false,
      message: `Failed to bootstrap chat: ${errorMessage}`,
    }
  }
}

// Token Management Server Actions

export async function getUserToken(): Promise<{ hasToken: boolean }> {
  const user = await getCachedUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  return { hasToken: !!user.v0token }
}

export async function saveUserToken(token: string): Promise<void> {
  const user = await getCachedUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  await updateUserV0Token(user.clerkId, token)
}

export async function deleteUserToken(): Promise<void> {
  const user = await getCachedUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  await updateUserV0Token(user.clerkId, null)
}

// Modified createV0Chat to support user tokens
export async function createV0ChatWithToken(
  repoUrl: string,
  branch: string,
  useUserToken = false,
): Promise<ChatCreationResult> {
  let apiKey = process.env.V0_API_KEY

  // If user token is requested, use it
  if (useUserToken) {
    const user = await getCachedUser()
    if (!user) {
      throw new Error('Not authenticated')
    }

    const token = await getDecryptedV0Token(user.clerkId)
    if (!token) {
      throw new Error('No token found. Please add your v0 API key.')
    }

    apiKey = token
  } else if (!apiKey) {
    throw new Error(
      'No API key available. Please provide an API key or set V0_API_KEY.',
    )
  }

  // Generate custom chat name
  const chatName = generateChatName(repoUrl, branch)

  // Create a custom v0 client with the specific token
  const client = createClient({ apiKey })

  const chat = await client.chats.init({
    type: 'repo',
    repo: {
      url: repoUrl,
      branch,
    },
    chatPrivacy: useUserToken ? 'private' : 'public',
    name: chatName,
  })

  return {
    id: chat.id,
    url: chat.webUrl,
    demo: chat.latestVersion?.demoUrl || '',
  }
}
