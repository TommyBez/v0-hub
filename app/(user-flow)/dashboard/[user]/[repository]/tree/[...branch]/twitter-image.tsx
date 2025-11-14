import { createSocialImage, TWITTER_SIZE } from '@/lib/social-image'

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
export const size = TWITTER_SIZE
export const contentType = 'image/png'

export default async function Image({ params }: BranchImageProps) {
  const { user, repository, branch } = await params
  const repoSlug = `${user}/${repository}`
  const branchLabel = formatBranch(branch)

  return createSocialImage({
    title: `Dashboard · ${repository}`,
    subtitle: `Guided v0 workspace for ${branchLabel}.`,
    badge: 'Dashboard',
    tag: 'guided',
    meta: repoSlug,
    size: TWITTER_SIZE,
  })
}
