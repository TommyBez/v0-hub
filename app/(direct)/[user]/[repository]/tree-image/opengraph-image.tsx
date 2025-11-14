import { createSocialImage, OPEN_GRAPH_SIZE } from '@/lib/social-image'

type BranchSearchParams = {
  branch?: string | string[]
}

type ImageProps = {
  params: Promise<{
    user: string
    repository: string
  }>
  searchParams: Promise<BranchSearchParams>
}

const resolveBranch = (value?: string | string[]) => {
  if (!value) {
    return 'default'
  }
  if (Array.isArray(value)) {
    return value.at(0) ?? 'default'
  }
  return value
}

export const runtime = 'edge'
export const size = OPEN_GRAPH_SIZE
export const contentType = 'image/png'

export default async function Image({ params, searchParams }: ImageProps) {
  const { user, repository } = await params
  const resolvedSearchParams = await searchParams
  const branchLabel = resolveBranch(resolvedSearchParams?.branch)
  const repoSlug = `${user}/${repository}`

  return createSocialImage({
    title: `${repository} · ${branchLabel}`,
    subtitle: 'v0hub is creating a ready-to-edit chat for this branch.',
    badge: 'Branch preview',
    tag: 'direct route',
    meta: `${repoSlug} • ${branchLabel}`,
  })
}
