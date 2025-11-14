import { createSocialImage, TWITTER_SIZE } from '@/lib/social-image'

type ImageProps = {
  params: Promise<{
    user: string
    repository: string
  }>
}

export const runtime = 'edge'
export const size = TWITTER_SIZE
export const contentType = 'image/png'

export default async function Image({ params }: ImageProps) {
  const { user, repository } = await params
  const repoSlug = `${user}/${repository}`

  return createSocialImage({
    title: `Working on ${repoSlug}`,
    subtitle:
      'The v0 agent is preparing a contextual chat for this repository.',
    badge: 'Repository',
    tag: 'direct',
    meta: repoSlug,
    size: TWITTER_SIZE,
  })
}
