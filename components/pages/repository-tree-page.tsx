import { Redis } from '@upstash/redis'
import { redirect } from 'next/navigation'
import { createV0Chat, createV0ChatWithToken } from '@/app/actions'
import { syncCurrentUser } from '@/db/queries'
import { getBranchCommit } from '@/lib/github-client'
import { logger } from '@/lib/logger'
import { searchParamsCache } from '@/lib/search-params'

export interface RepositoryTreePageProps {
  params: Promise<{
    user: string
    repository: string
    branch: string[]
  }>
}

export default async function RepositoryTreePage({
  params,
}: RepositoryTreePageProps) {
  const user = await syncCurrentUser()
  const redis = Redis.fromEnv()
  const { user: githubUser, repository, branch } = await params
  const searchParamsData = searchParamsCache.all()
  const fullBranchName = branch.join('/')
  const repoUrl = `https://github.com/${githubUser}/${repository}`
  const isPrivate = searchParamsData.private
  let commit = searchParamsData.commit

  logger.info({ user })
  // Handle private repositories with token
  if (isPrivate || user?.v0token) {
    const chatData = await createV0ChatWithToken(
      repoUrl,
      fullBranchName,
      isPrivate,
    )
    return redirect(chatData.url)
  }

  // If no commit is provided, try to get it from cache or fetch it
  if (!commit) {
    const cachedCommit = await redis.get<string>(
      `commit:${fullBranchName}:${githubUser}:${repository}`,
    )
    if (cachedCommit) {
      commit = cachedCommit
    } else {
      // Use GraphQL to get branch commit efficiently
      const branchCommit = await getBranchCommit(
        githubUser,
        repository,
        fullBranchName,
      )
      if (!branchCommit) {
        return redirect(`/${githubUser}/${repository}`)
      }
      commit = branchCommit
      await redis.set(
        `commit:${fullBranchName}:${githubUser}:${repository}`,
        commit,
        { ex: 60 * 60 },
      )
    }
  }

  // Check if we have a cached chat URL for this specific commit
  const cachedChatUrl = await redis.get<string>(
    `chat:${repoUrl}:${fullBranchName}:${commit}`,
  )
  if (cachedChatUrl) {
    return redirect(cachedChatUrl)
  }

  // Create new chat and cache the URL
  const chatData = await createV0Chat(repoUrl, fullBranchName)
  await redis.set(`chat:${repoUrl}:${fullBranchName}:${commit}`, chatData.url, {
    ex: 60 * 60,
  })

  return redirect(chatData.url)
}
