import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ user: string; repository: string }> },
) {
  const redis = Redis.fromEnv()
  const { user, repository } = await params
  const cachedMainCommit = await redis.get<string>(`main:${user}:${repository}`)

  if (cachedMainCommit) {
    return NextResponse.redirect(
      new URL(
        `/${user}/${repository}/tree/main?commit=${cachedMainCommit}`,
        request.url,
      ),
    )
  }
  const main = await fetch(
    `https://api.github.com/repos/${user}/${repository}/branches/main`,
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'v0-github-bootstrapper',
      },
    },
  )
  if (main.ok) {
    const mainBranch = await main.json()
    await redis.set(`main:${user}:${repository}`, mainBranch.commit.sha)
    return NextResponse.redirect(
      new URL(
        `/${user}/${repository}/tree/main?commit=${mainBranch.commit.sha}`,
        request.url,
      ),
    )
  }
  const cachedMasterCommit = await redis.get<string>(
    `master:${user}:${repository}`,
  )
  if (cachedMasterCommit) {
    return NextResponse.redirect(
      new URL(
        `/${user}/${repository}/tree/master?commit=${cachedMasterCommit}`,
        request.url,
      ),
    )
  }
  const master = await fetch(
    `https://api.github.com/repos/${user}/${repository}/branches/master`,
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'v0-github-bootstrapper',
      },
    },
  )
  if (master.ok) {
    const masterBranch = await master.json()
    await redis.set(`master:${user}:${repository}`, masterBranch.commit.sha)
    return NextResponse.redirect(
      new URL(
        `/${user}/${repository}/tree/master?commit=${masterBranch.commit.sha}`,
        request.url,
      ),
    )
  }

  return NextResponse.redirect(
    new URL(`/dashboard/${user}/${repository}`, request.url),
  )
}
