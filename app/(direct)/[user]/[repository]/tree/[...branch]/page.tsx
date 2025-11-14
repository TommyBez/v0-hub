import type { Metadata } from 'next'
import type { SearchParams } from 'nuqs/server'
import RepositoryTreePage, {
  type RepositoryTreePageProps,
} from '@/components/pages/repository-tree-page'
import { searchParamsCache } from '@/lib/search-params'
import { getSiteOrigin } from '@/lib/utils'

type PageProps = {
  searchParams: Promise<SearchParams>
} & RepositoryTreePageProps

const buildImageUrl = (
  origin: string,
  user: string,
  repository: string,
  type: 'opengraph-image' | 'twitter-image',
  branch: string[],
) => {
  const url = new URL(`/${user}/${repository}/tree-image/${type}`, origin)
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
  const title = `${repository} · ${branchLabel}`

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

export default async function Page({ searchParams, ...props }: PageProps) {
  await searchParamsCache.parse(searchParams)
  return <RepositoryTreePage {...props} />
}
