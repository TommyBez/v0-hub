import { Octokit } from 'octokit'

// Create a shared Octokit client instance
const octokit = new Octokit({
  userAgent: 'v0-github-bootstrapper',
})

// GraphQL query to get repository info with default branch and specific branches
const GET_REPOSITORY_WITH_BRANCHES = `
  query GetRepositoryWithBranches($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      defaultBranchRef {
        name
        target {
          ... on Commit {
            oid
          }
        }
      }
      refs(refPrefix: "refs/heads/", first: 10) {
        nodes {
          name
          target {
            ... on Commit {
              oid
            }
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

export interface BranchInfo {
  name: string
  commit: string
}

export interface RepositoryInfo {
  defaultBranch: BranchInfo | null
  branches: BranchInfo[]
}

export async function getRepositoryWithBranches(
  owner: string,
  name: string,
): Promise<RepositoryInfo | null> {
  try {
    const response = await octokit.graphql<{
      repository: {
        defaultBranchRef: {
          name: string
          target: {
            oid: string
          }
        } | null
        refs: {
          nodes: Array<{
            name: string
            target: {
              oid: string
            }
          }>
        }
      }
    }>(GET_REPOSITORY_WITH_BRANCHES, {
      owner,
      name,
    })

    const { repository } = response
    if (!repository) return null

    const defaultBranch = repository.defaultBranchRef
      ? {
          name: repository.defaultBranchRef.name,
          commit: repository.defaultBranchRef.target.oid,
        }
      : null

    const branches = repository.refs.nodes.map(branch => ({
      name: branch.name,
      commit: branch.target.oid,
    }))

    return {
      defaultBranch,
      branches,
    }
  } catch (error) {
    console.error('Failed to fetch repository info:', error)
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
    console.error('Failed to fetch branch commit:', error)
    return null
  }
}