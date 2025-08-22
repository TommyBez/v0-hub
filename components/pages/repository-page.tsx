import { Redis } from '@upstash/redis'
import { notFound, redirect } from 'next/navigation'
import { getRepositoryWithBranches, type BranchInfo } from '@/lib/github-client'

export interface RepositoryPageParams {
  user: string
  repository: string
}

export interface RepositoryPageProps {
  params: Promise<RepositoryPageParams>
}

export default async function RepositoryPage({ params }: RepositoryPageProps) {
  const redis = Redis.fromEnv()
  const { user, repository } = await params

  // Check for cached commits for main, master, and default branch
  const cachedMainCommit = await redis.get<string>(
    `commit:main:${user}:${repository}`,
  )
  if (cachedMainCommit) {
    redirect(`/${user}/${repository}/tree/main?commit=${cachedMainCommit}`)
  }

  const cachedMasterCommit = await redis.get<string>(
    `commit:master:${user}:${repository}`,
  )
  if (cachedMasterCommit) {
    redirect(`/${user}/${repository}/tree/master?commit=${cachedMasterCommit}`)
  }

  const cachedDefaultBranch = await redis.get<string>(
    `default-branch:${user}:${repository}`,
  )
  if (cachedDefaultBranch) {
    const cachedDefaultCommit = await redis.get<string>(
      `commit:${cachedDefaultBranch}:${user}:${repository}`,
    )
    if (cachedDefaultCommit) {
      redirect(
        `/${user}/${repository}/tree/${cachedDefaultBranch}?commit=${cachedDefaultCommit}`,
      )
    }
  }

  // Fetch repository information with all branches in a single GraphQL query
  const repoInfo = await getRepositoryWithBranches(user, repository)
  if (!repoInfo) {
    return notFound()
  }

  // Helper function to find branch by name
  const findBranch = (branchName: string): BranchInfo | undefined => {
    return repoInfo.branches.find(branch => branch.name === branchName)
  }

  // Try to find main branch first
  const mainBranch = findBranch('main')
  if (mainBranch) {
    await redis.set(
      `commit:main:${user}:${repository}`,
      mainBranch.commit,
      { ex: 60 * 60 },
    )
    redirect(`/${user}/${repository}/tree/main?commit=${mainBranch.commit}`)
  }

  // Try to find master branch if main doesn't exist
  const masterBranch = findBranch('master')
  if (masterBranch) {
    await redis.set(
      `commit:master:${user}:${repository}`,
      masterBranch.commit,
      { ex: 60 * 60 },
    )
    redirect(`/${user}/${repository}/tree/master?commit=${masterBranch.commit}`)
  }

  // Fall back to default branch
  if (repoInfo.defaultBranch) {
    const { name: defaultBranchName, commit: defaultCommit } = repoInfo.defaultBranch
    
    // Cache the default branch name and commit
    await redis.set(
      `default-branch:${user}:${repository}`,
      defaultBranchName,
      { ex: 60 * 60 },
    )
    await redis.set(
      `commit:${defaultBranchName}:${user}:${repository}`,
      defaultCommit,
      { ex: 60 * 60 },
    )
    
    redirect(
      `/${user}/${repository}/tree/${defaultBranchName}?commit=${defaultCommit}`,
    )
  }

  // If no branches are found, return 404
  return notFound()
}
