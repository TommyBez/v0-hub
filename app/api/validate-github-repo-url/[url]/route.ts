import { Redis } from '@upstash/redis'
import { type NextRequest, NextResponse } from 'next/server'
import { checkGithubRepoUrl } from '@/lib/github-client'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ url: string }> },
) {
  const redis = Redis.fromEnv()
  const { url } = await params
  const decodedUrl = decodeURIComponent(url)
  if (!decodedUrl) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  const cached = await redis.get(decodedUrl)
  if (cached !== null && cached !== undefined) {
    // Convert cached value to boolean (handle string "true"/"false" or boolean values)
    const isValid =
      typeof cached === 'string' ? cached === 'true' : Boolean(cached)
    return NextResponse.json({ isValid })
  }

  const response = await checkGithubRepoUrl(decodedUrl)
  const isValid = response.status === 200
  await redis.set(decodedUrl, isValid)
  return NextResponse.json({ isValid })
}
