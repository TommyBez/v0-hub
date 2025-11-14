import { createSocialImage, OPEN_GRAPH_SIZE } from '@/lib/social-image'

export const runtime = 'edge'
export const size = OPEN_GRAPH_SIZE
export const contentType = 'image/png'

export default function Image() {
  return createSocialImage({
    title: 'Securely store your v0 API key',
    subtitle:
      'Encrypt your private GitHub token so v0hub can spin up chats for private repositories.',
    badge: 'Private mode',
    tag: 'token settings',
    meta: 'Encrypted at rest • scoped per user',
  })
}
