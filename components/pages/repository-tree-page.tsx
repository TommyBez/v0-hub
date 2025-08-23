import { Redis } from '@upstash/redis'
import { redirect } from 'next/navigation'
import { createV0Chat, createV0ChatWithToken } from '@/app/actions'
import { getBranchCommit } from '@/lib/github-client'
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
  const redis = Redis.fromEnv()
  const { user, repository, branch } = await params
  const searchParamsData = searchParamsCache.all()
  const fullBranchName = branch.join('/')
  const repoUrl = `https://github.com/${user}/${repository}`
  const isPrivate = searchParamsData.private
  let commit = searchParamsData.commit

  // Handle private repositories with token
  if (isPrivate) {
    const chatData = await createV0ChatWithToken(repoUrl, fullBranchName, true)
    return redirect(chatData.url)
  }

  // If no commit is provided, try to get it from cache or fetch it
  if (!commit) {
    const cachedCommit = await redis.get<string>(
      `commit:${fullBranchName}:${user}:${repository}`,
    )
    if (cachedCommit) {
      commit = cachedCommit
    } else {
      // Use GraphQL to get branch commit efficiently
      const branchCommit = await getBranchCommit(
        user,
        repository,
        fullBranchName,
      )
      if (!branchCommit) {
        return redirect(`/${user}/${repository}`)
      }
      commit = branchCommit
      await redis.set(
        `commit:${fullBranchName}:${user}:${repository}`,
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
