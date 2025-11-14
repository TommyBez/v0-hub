import type { Metadata } from 'next'
import RepositoryTreePage, {
  type RepositoryTreePageProps,
} from '@/components/pages/repository-tree-page'
import { getSiteOrigin } from '@/lib/utils'

const buildImageUrl = (
  origin: string,
  user: string,
  repository: string,
  type: 'opengraph-image' | 'twitter-image',
  branch: string[],
) => {
  const url = new URL(
    `/dashboard/${user}/${repository}/tree-image/${type}`,
    origin,
  )
  if (branch.length > 0) {
    url.searchParams.set('branch', branch.join('/'))
  }
  return url.toString()
}

export async function generateMetadata({
  params,
}: RepositoryTreePageProps): Promise<Metadata> {
  const { user, repository, branch } = await params
  const origin = getSiteOrigin()
  const branchLabel = branch.length > 0 ? branch.join('/') : 'default'
  const title = `Dashboard · ${repository} (${branchLabel})`

  const openGraphImage = buildImageUrl(
    origin,
    user,
    repository,
    'opengraph-image',
    branch,
  )
  const twitterImage = buildImageUrl(
    origin,
    user,
    repository,
    'twitter-image',
    branch,
  )

  return {
    title,
    openGraph: {
      title,
      images: [{ url: openGraphImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      images: [twitterImage],
    },
  }
}

export default function Page(props: RepositoryTreePageProps) {
  return <RepositoryTreePage {...props} />
}
