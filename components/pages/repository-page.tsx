import { Redis } from '@upstash/redis'
import { notFound, redirect } from 'next/navigation'
import { getRepositoryWithDefaultBranch } from '@/lib/github-client'

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
  const cachedDefaultBranchInfo = await redis.get<{
    defaultBranchName: string
    defaultCommit: string
  }>(`default-branch-info:${user}:${repository}`)

  if (cachedDefaultBranchInfo) {
    const {
      defaultBranchName: cachedDefaultBranchName,
      defaultCommit: cachedDefaultCommit,
    } = cachedDefaultBranchInfo
    redirect(
      `/${user}/${repository}/tree/${cachedDefaultBranchName}?commit=${cachedDefaultCommit}`,
    )
  }

  // Fetch repository information to get default branch
  const repoInfo = await getRepositoryWithDefaultBranch(user, repository)
  if (!repoInfo?.defaultBranch) {
    return notFound()
  }

  const { name: defaultBranchName, commit: defaultCommit } =
    repoInfo.defaultBranch

  // Cache the default branch name and commit
  await redis.set(
    `default-branch-info:${user}:${repository}`,
    {
      defaultBranchName,
      defaultCommit,
    },
    { ex: 60 * 60 },
  )

  redirect(
    `/${user}/${repository}/tree/${defaultBranchName}?commit=${defaultCommit}`,
  )
}
