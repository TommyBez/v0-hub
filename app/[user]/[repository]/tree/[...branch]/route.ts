import { Redis } from '@upstash/redis'
import { type NextRequest, NextResponse } from 'next/server'
import { createV0Chat } from '@/app/actions'

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ user: string; repository: string; branch: string[] }>
  },
) {
  const redis = Redis.fromEnv()
  const { user, repository, branch } = await params
  const searchParams = request.nextUrl.searchParams
  const commit = searchParams.get('commit')
  const fullBranchName = branch.join('/')
  const repoUrl = `https://github.com/${user}/${repository}`
  const cachedChatUrl = await redis.get<string>(
    `chat:${repoUrl}:${fullBranchName}:${commit}`,
  )
  if (cachedChatUrl) {
    return NextResponse.redirect(cachedChatUrl)
  }
  const chatData = await createV0Chat(repoUrl, fullBranchName)
  await redis.set(`chat:${repoUrl}:${fullBranchName}:${commit}`, chatData.url)
  return NextResponse.redirect(chatData.url)
}
