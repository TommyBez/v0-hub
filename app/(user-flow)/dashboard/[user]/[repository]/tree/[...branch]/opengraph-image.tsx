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
    subtitle:
      'Dashboard mode keeps the v0 agent focused on curated workstreams.',
    badge: 'Dashboard',
    tag: 'guided flow',
    meta: `${repoSlug} • ${branchLabel}`,
  })
}
