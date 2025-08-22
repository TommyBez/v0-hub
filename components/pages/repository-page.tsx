import { Redis } from '@upstash/redis'
import { notFound, redirect } from 'next/navigation'

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
  const cachedMainCommit = await redis.get<string>(
    `commit:main:${user}:${repository}`,
  )

  if (cachedMainCommit) {
    redirect(`/${user}/${repository}/tree/main?commit=${cachedMainCommit}`)
  }
  const main = await fetch(
    `https://api.github.com/repos/${user}/${repository}/branches/main`,
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'v0-github-bootstrapper',
      },
      cache: 'no-store',
    },
  )
  if (main.ok) {
    const mainBranch = await main.json()
    await redis.set(
      `commit:main:${user}:${repository}`,
      mainBranch.commit.sha,
      { ex: 60 * 60 },
    )
    return redirect(
      `/${user}/${repository}/tree/main?commit=${mainBranch.commit.sha}`,
    )
  }
  const cachedMasterCommit = await redis.get<string>(
    `commit:master:${user}:${repository}`,
  )
  if (cachedMasterCommit) {
    redirect(`/${user}/${repository}/tree/master?commit=${cachedMasterCommit}`)
  }
  const master = await fetch(
    `https://api.github.com/repos/${user}/${repository}/branches/master`,
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'v0-github-bootstrapper',
      },
      cache: 'no-store',
    },
  )
  if (master.ok) {
    const masterBranch = await master.json()
    await redis.set(
      `commit:master:${user}:${repository}`,
      masterBranch.commit.sha,
      { ex: 60 * 60 },
    )
    redirect(
      `/${user}/${repository}/tree/master?commit=${masterBranch.commit.sha}`,
    )
  }

  const cachedRepoDefaultBranch = await redis.get<string>(
    `default-branch:${user}:${repository}`,
  )
  if (cachedRepoDefaultBranch) {
    return redirect(`/${user}/${repository}/tree/${cachedRepoDefaultBranch}`)
  }

  const repoRes = await fetch(
    `https://api.github.com/repos/${user}/${repository}`,
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'v0-github-bootstrapper',
      },
      cache: 'no-store',
    },
  )

  if (repoRes.ok) {
    const repo = await repoRes.json()
    await redis.set(
      `default-branch:${user}:${repository}`,
      repo.default_branch,
      { ex: 60 * 60 },
    )
    const defaultBranch: string | undefined = repo?.default_branch
    if (defaultBranch) {
      const cacheKey = `branch:${user}:${repository}:${defaultBranch}`
      const cachedDefaultCommit = await redis.get<string>(cacheKey)
      if (cachedDefaultCommit) {
        return redirect(
          `/${user}/${repository}/tree/${defaultBranch}?commit=${cachedDefaultCommit}`,
        )
      }

      const branchRes = await fetch(
        `https://api.github.com/repos/${user}/${repository}/branches/${encodeURIComponent(defaultBranch)}`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'v0-github-bootstrapper',
          },
          cache: 'no-store',
        },
      )

      if (branchRes.ok) {
        const branchData = await branchRes.json()
        await redis.set(cacheKey, branchData.commit.sha, { ex: 900 })

        return redirect(
          `/${user}/${repository}/tree/${defaultBranch}?commit=${branchData.commit.sha}`,
        )
      }
    }
  }
  return notFound()
}
