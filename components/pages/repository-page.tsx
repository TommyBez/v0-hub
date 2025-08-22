import { Redis } from '@upstash/redis'
import { notFound, redirect } from 'next/navigation'
import { getRepositoryWithBranches } from '@/lib/github-client'

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

  // Check for cached default branch and commit
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

  // Fetch repository information to get default branch
  const repoInfo = await getRepositoryWithBranches(user, repository)
  if (!repoInfo || !repoInfo.defaultBranch) {
    return notFound()
  }

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
