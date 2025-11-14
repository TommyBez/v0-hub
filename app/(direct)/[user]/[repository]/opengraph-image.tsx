import { createSocialImage, OPEN_GRAPH_SIZE } from '@/lib/social-image'

type ImageProps = {
  params: Promise<{
    user: string
    repository: string
  }>
}

export const runtime = 'edge'
export const size = OPEN_GRAPH_SIZE
export const contentType = 'image/png'

export default async function Image({ params }: ImageProps) {
  const { user, repository } = await params
  const repoSlug = `${user}/${repository}`

  return createSocialImage({
    title: repoSlug,
    subtitle:
      'v0hub resolves the default branch before launching the full tree view.',
    badge: 'Repository',
    tag: 'direct mode',
    meta: `${repoSlug} • default branch lookup`,
  })
}
