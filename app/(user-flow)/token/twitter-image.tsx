import { createSocialImage, TWITTER_SIZE } from '@/lib/social-image'

export const runtime = 'edge'
export const size = TWITTER_SIZE
export const contentType = 'image/png'

export default function Image() {
  return createSocialImage({
    title: 'Unlock private GitHub repos with v0hub',
    subtitle:
      'Bring your API key once—every private branch inherits secure access.',
    badge: 'Private mode',
    tag: 'token',
    meta: 'Personal token storage',
    size: TWITTER_SIZE,
  })
}
