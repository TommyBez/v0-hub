import { createSocialImage, TWITTER_SIZE } from '@/lib/social-image'

export const runtime = 'edge'
export const size = TWITTER_SIZE
export const contentType = 'image/png'

export default function Image() {
  return createSocialImage({
    title: 'Work on any GitHub repo with the v0 agent',
    subtitle: 'Bootstrap a collaborative v0 chat for every branch in seconds.',
    badge: 'Public beta',
    tag: 'twitter',
    meta: 'v0hub.app • GitHub automation',
    size: TWITTER_SIZE,
  })
}
