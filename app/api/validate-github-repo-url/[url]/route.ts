import { Redis } from '@upstash/redis'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ url: string }> },
) {
  const redis = Redis.fromEnv()
  const { url } = await params
  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  const cached = await redis.get(url)
  if (cached) {
    return NextResponse.json({ isValid: cached })
  }

  const response = await fetch(`https://api.github.com/repos/${url}`)
  const isValid = response.status === 200
  await redis.set(url, isValid)
  return NextResponse.json({ isValid })
}
