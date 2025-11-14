import { createSocialImage, OPEN_GRAPH_SIZE } from '@/lib/social-image'

export const runtime = 'edge'
export const size = OPEN_GRAPH_SIZE
export const contentType = 'image/png'

export default function Image() {
  return createSocialImage({
    title: 'Work on any GitHub repo with the v0 agent',
    subtitle:
      'Paste a repository URL, pick a branch, and v0hub bootstraps a chat that is ready to ship.',
    badge: 'Public beta',
    tag: 'home',
    meta: 'GitHub • v0 sdk • Redis cache',
  })
}
