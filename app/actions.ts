'use server'

import { createClient, v0 } from 'v0-sdk'
import { z } from 'zod'
import {
  createChat,
  getCachedUser,
  getDecryptedV0Token,
  updateUserV0Token,
} from '@/db/queries'
import type { User } from '@/db/schema'
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
  const normalizedBranch = branch.toLowerCase().trim()
  const shouldIncludeBranch =
    normalizedBranch !== 'main' && normalizedBranch !== 'master'

  return shouldIncludeBranch
    ? `[v0hub] ${repoName} - ${normalizedBranch}`
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

  // Save to database if user is authenticated
  try {
    const user = await getCachedUser()
    if (user) {
      await createChat({
        v0id: chat.id,
        userId: user.id,
        owned: false, // Created with server's API key
        repositoryUrl: repoUrl, // Save the repository URL
        branch, // Save the branch name
      })
    }
  } catch (error) {
    // Log error but don't fail the chat creation
    logger.error(`Failed to save chat to database: ${error}`)
  }

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

// Helper function to fetch a single page of branches
async function fetchBranchPage(
  owner: string,
  repo: string,
  page: number,
  perPage: number,
): Promise<{
  branches: string[]
  hasNext: boolean
  error?: { status: number; message: string }
}> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/branches?per_page=${perPage}&page=${page}`,
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'v0-github-bootstrapper',
      },
    },
  )

  if (!response.ok) {
    if (response.status === 404) {
      return {
        branches: [],
        hasNext: false,
        error: { status: 404, message: 'Repository not found or is private' },
      }
    }
    if (response.status === 403) {
      return {
        branches: [],
        hasNext: false,
        error: {
          status: 403,
          message: 'Rate limit exceeded. Please try again later.',
        },
      }
    }
    return {
      branches: [],
      hasNext: false,
      error: {
        status: response.status,
        message: `GitHub API error: ${response.status}`,
      },
    }
  }

  const branchData = await response.json()
  const branches = branchData.map((branch: { name: string }) => branch.name)
  const linkHeader = response.headers.get('Link')
  const hasNext = linkHeader ? linkHeader.includes('rel="next"') : false

  return { branches, hasNext }
}

// Recursive function to fetch remaining pages
async function fetchRemainingPages(
  owner: string,
  repo: string,
  currentPage: number,
  perPage: number,
  maxPage: number,
): Promise<string[]> {
  if (currentPage > maxPage) {
    return []
  }

  const pageData = await fetchBranchPage(owner, repo, currentPage, perPage)
  if (
    pageData.error ||
    !pageData.hasNext ||
    pageData.branches.length < perPage
  ) {
    return pageData.branches
  }

  const nextPages = await fetchRemainingPages(
    owner,
    repo,
    currentPage + 1,
    perPage,
    maxPage,
  )
  return [...pageData.branches, ...nextPages]
}

// New action to fetch branches from GitHub
export async function fetchGitHubBranches(
  repoUrl: string,
): Promise<{ success: boolean; branches?: string[]; error?: string }> {
  try {
    // Extract owner and repo from URL
    const match = repoUrl.match(GITHUB_REPO_URL_REGEX_WITH_BRANCH)
    if (!match) {
      return { success: false, error: 'Invalid GitHub repository URL' }
    }

    const [, owner, repo] = match
    const allBranches: string[] = []
    const perPage = 100 // Maximum allowed by GitHub API

    // Fetch first page to determine if pagination is needed
    const firstPage = await fetchBranchPage(owner, repo, 1, perPage)
    if (firstPage.error) {
      return { success: false, error: firstPage.error.message }
    }

    allBranches.push(...firstPage.branches)

    // Fetch remaining pages using recursive function to avoid await in loop
    if (firstPage.hasNext && firstPage.branches.length === perPage) {
      const remainingBranches = await fetchRemainingPages(
        owner,
        repo,
        2, // Start from page 2
        perPage,
        50, // Max pages
      )
      allBranches.push(...remainingBranches)
    }

    return { success: true, branches: allBranches }
  } catch (error) {
    logger.error(`Error fetching branches: ${error}`)
    return { success: false, error: 'Failed to fetch branches' }
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
  let user: User | null = null

  // If user token is requested, use it
  if (useUserToken) {
    user = await getCachedUser()
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

  // Save to database if user is authenticated
  try {
    // Get current user if not already fetched
    if (!user) {
      user = await getCachedUser()
    }

    if (user) {
      await createChat({
        v0id: chat.id,
        userId: user.id,
        owned: useUserToken, // true if created with user's API key
        repositoryUrl: repoUrl, // Save the repository URL
        branch, // Save the branch name
      })
    }
  } catch (error) {
    // Log error but don't fail the chat creation
    logger.error(`Failed to save chat to database: ${error}`)
  }

  return {
    id: chat.id,
    url: chat.webUrl,
    demo: chat.latestVersion?.demoUrl || '',
  }
}
