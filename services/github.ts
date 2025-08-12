import { logger } from '@/lib/logger'

const GITHUB_REPO_URL_REGEX_WITH_BRANCH =
  /^https:\/\/github\.com\/([^/]+)\/([^/]+)(?:\.git)?(?:\/)?$/

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

// Service function to fetch branches from GitHub
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
