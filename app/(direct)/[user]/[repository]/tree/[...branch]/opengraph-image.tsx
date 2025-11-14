import { createSocialImage, OPEN_GRAPH_SIZE } from '@/lib/social-image'

type BranchImageProps = {
  params: Promise<{
    user: string
    repository: string
    branch: string[]
  }>
}

const formatBranch = (segments: string[]) =>
  segments.length > 0 ? segments.join('/') : 'default'

export const runtime = 'edge'
export const size = OPEN_GRAPH_SIZE
export const contentType = 'image/png'

export default async function Image({ params }: BranchImageProps) {
  const { user, repository, branch } = await params
  const repoSlug = `${user}/${repository}`
  const branchLabel = formatBranch(branch)

  return createSocialImage({
    title: `${repository} · ${branchLabel}`,
    subtitle: 'v0hub is creating a ready-to-edit chat for this branch.',
    badge: 'Branch preview',
    tag: 'direct route',
    meta: `${repoSlug} • ${branchLabel}`,
  })
}
