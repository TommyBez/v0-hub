import { Octokit } from 'octokit'
import { logger } from './logger'

// Get GitHub token from environment variables
const githubToken = process.env.GITHUB_TOKEN

if (!githubToken) {
  throw new Error(
    'GitHub authentication token is required. Please set either GITHUB_TOKEN or GH_TOKEN environment variable.',
  )
}

// Create a shared Octokit client instance with authentication
const octokit = new Octokit({
  auth: githubToken,
  userAgent: 'v0-github-bootstrapper',
})

// GraphQL query to get repository info with default branch and specific branches
const GET_REPOSITORY_WITH_DEFAULT_BRANCH = `
  query GetRepositoryWithDefaultBranch($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      defaultBranchRef {
        name
        target {
          ... on Commit {
            oid
          }
        }
      }
    }
  }
`

// GraphQL query to get specific branch commit
const GET_BRANCH_COMMIT = `
  query GetBranchCommit($owner: String!, $name: String!, $branch: String!) {
    repository(owner: $owner, name: $name) {
      ref(qualifiedName: $branch) {
        target {
          ... on Commit {
            oid
          }
        }
      }
    }
  }
`

export async function getRepositoryWithDefaultBranch(
  owner: string,
  name: string,
) {
  try {
    const response = await octokit.graphql<{
      repository: {
        defaultBranchRef: {
          name: string
          target: {
            oid: string
          }
        } | null
      }
    }>(GET_REPOSITORY_WITH_DEFAULT_BRANCH, {
      owner,
      name,
    })

    const { repository } = response
    if (!repository) {
      return null
    }

    const defaultBranch = repository.defaultBranchRef
      ? {
          name: repository.defaultBranchRef.name,
          commit: repository.defaultBranchRef.target.oid,
        }
      : null

    return {
      defaultBranch,
    }
  } catch (error) {
    logger.error(`Failed to fetch repository info: ${error}`)
    return null
  }
}

export async function getBranchCommit(
  owner: string,
  name: string,
  branch: string,
): Promise<string | null> {
  try {
    const response = await octokit.graphql<{
      repository: {
        ref: {
          target: {
            oid: string
          }
        } | null
      }
    }>(GET_BRANCH_COMMIT, {
      owner,
      name,
      branch: `refs/heads/${branch}`,
    })

    return response.repository?.ref?.target?.oid || null
  } catch (error) {
    logger.error(`Failed to fetch branch commit: ${error}`)
    return null
  }
}

// GraphQL query to get all branches with pagination and default branch
const GET_REPOSITORY_BRANCHES = `
  query GetRepositoryBranches($owner: String!, $name: String!, $after: String, $first: Int = 100) {
    repository(owner: $owner, name: $name) {
      defaultBranchRef {
        name
      }
      refs(refPrefix: "refs/heads/", first: $first, after: $after) {
        nodes {
          name
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`

// Regular expression for parsing GitHub URLs
const GITHUB_REPO_URL_REGEX_WITH_BRANCH =
  /^https:\/\/github\.com\/([^/]+)\/([^/]+)(?:\.git)?(?:\/)?$/

type RepositoryBranchesResponse = {
  repository: {
    defaultBranchRef: {
      name: string
    } | null
    refs: {
      nodes: Array<{ name: string }>
      pageInfo: {
        hasNextPage: boolean
        endCursor: string | null
      }
    }
  } | null
}

type FetchBranchesResult = {
  branches: string[]
  defaultBranch: string | null
}

async function fetchBranchesRecursive(
  owner: string,
  repo: string,
  cursor: string | null = null,
  accumulatedBranches: string[] = [],
  capturedDefaultBranch: string | null = null,
): Promise<FetchBranchesResult> {
  const response: RepositoryBranchesResponse = await octokit.graphql(
    GET_REPOSITORY_BRANCHES,
    {
      owner,
      name: repo,
      after: cursor,
      first: 100, // GitHub's max per page
    },
  )

  if (!response.repository) {
    throw new Error('Repository not found or is private')
  }

  const { refs, defaultBranchRef } = response.repository

  // On first call, capture the default branch
  const defaultBranch =
    cursor === null && defaultBranchRef
      ? defaultBranchRef.name
      : capturedDefaultBranch

  // Add branch names to our accumulated array
  const allBranches = [
    ...accumulatedBranches,
    ...refs.nodes.map((node) => node.name),
  ]

  // If there are more pages, recursively fetch them
  if (refs.pageInfo.hasNextPage) {
    return fetchBranchesRecursive(
      owner,
      repo,
      refs.pageInfo.endCursor,
      allBranches,
      defaultBranch,
    )
  }

  return {
    branches: allBranches,
    defaultBranch,
  }
}

export async function fetchGitHubBranches(
  repoUrl: string,
): Promise<FetchBranchesResult> {
  try {
    // Extract owner and repo from URL
    const match = repoUrl.match(GITHUB_REPO_URL_REGEX_WITH_BRANCH)
    if (!match) {
      throw new Error('Invalid GitHub repository URL')
    }

    const [, owner, repo] = match

    // Fetch all branches recursively
    return await fetchBranchesRecursive(owner, repo)
  } catch (error) {
    // Handle specific GitHub GraphQL errors
    if (error instanceof Error) {
      if (error.message.includes('Could not resolve to a Repository')) {
        throw new Error('Repository not found or is private')
      }
      if (error.message.includes('API rate limit exceeded')) {
        throw new Error('Rate limit exceeded. Please try again later.')
      }
    }

    logger.error(`Error fetching branches: ${error}`)
    throw new Error('Failed to fetch branches')
  }
}

export async function checkGithubRepoUrl(repoUrl: string) {
  try {
    const match = repoUrl.match(GITHUB_REPO_URL_REGEX_WITH_BRANCH)
    if (!match) {
      return false
    }

    const [, owner, repo] = match

    const response = await octokit.rest.repos.get({
      owner,
      repo,
    })
    return response?.status === 200
  } catch (error) {
    logger.error(`Error checking GitHub repository URL: ${error}`)
    return false
  }
}
