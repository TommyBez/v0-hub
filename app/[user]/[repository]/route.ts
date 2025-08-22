import { NextResponse } from 'next/server'
import { fetchGitHubBranches } from '@/app/actions'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ user: string; repository: string }> },
) {
  const { user, repository } = await params
  const repoUrl = `https://github.com/${user}/${repository}`
  const result = await fetchGitHubBranches(repoUrl)

  if (result.success && result.branches) {
    const names = new Set(result.branches)
    if (names.has('main')) {
      return NextResponse.redirect(`/${user}/${repository}/tree/main`)
    }
    if (names.has('master')) {
      return NextResponse.redirect(`/${user}/${repository}/tree/master`)
    }
  }
  NextResponse.redirect(`/dashboard/${user}/${repository}`)
}
