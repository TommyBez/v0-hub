import { NextResponse } from 'next/server'
import { createV0Chat } from '@/app/actions'

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ user: string; repository: string; branch: string[] }>
  },
) {
  const { user, repository, branch } = await params
  const fullBranchName = branch.join('/')
  const repoUrl = `https://github.com/${user}/${repository}`
  const chatData = await createV0Chat(repoUrl, fullBranchName)
  return NextResponse.redirect(chatData.url)
}
