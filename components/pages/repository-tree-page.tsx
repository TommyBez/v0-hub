import { Redis } from '@upstash/redis'
import { redirect } from 'next/navigation'
import { createV0Chat, createV0ChatWithToken } from '@/app/actions'

export interface RepositoryTreePageProps {
  params: Promise<{
    user: string
    repository: string
    branch: string[]
  }>
  searchParams: Promise<{ private?: string; commit?: string }>
}

export default async function RepositoryTreePage({
  params,
  searchParams,
}: RepositoryTreePageProps) {
  const redis = Redis.fromEnv()
  const { user, repository, branch } = await params
  const searchParamsData = await searchParams
  const fullBranchName = branch.join('/')
  const repoUrl = `https://github.com/${user}/${repository}`
  const isPrivate = searchParamsData.private === 'true'
  let commit = searchParamsData.commit

  if (isPrivate) {
    const chatData = await createV0ChatWithToken(repoUrl, fullBranchName, true)
    return redirect(chatData.url)
  }

  if (!commit) {
    const cachedCommit = await redis.get<string>(
      `commit:${fullBranchName}:${user}:${repository}`,
    )
    if (cachedCommit) {
      commit = cachedCommit
    } else {
      const main = await fetch(
        `https://api.github.com/repos/${user}/${repository}/branches/${fullBranchName}`,
      )
      const mainBranch = await main.json()
      commit = mainBranch.commit.sha
      await redis.set(
        `commit:${fullBranchName}:${user}:${repository}`,
        commit,
        { ex: 60 * 60 },
      )
    }
  }

  const cachedChatUrl = await redis.get<string>(
    `chat:${repoUrl}:${fullBranchName}:${commit}`,
  )
  if (cachedChatUrl) {
    return redirect(cachedChatUrl)
  }
  const chatData = await createV0Chat(repoUrl, fullBranchName)
  await redis.set(`chat:${repoUrl}:${fullBranchName}:${commit}`, chatData.url, {
    ex: 60 * 60,
  })
  return redirect(chatData.url)
}
