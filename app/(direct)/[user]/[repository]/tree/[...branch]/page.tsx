import type { SearchParams } from 'nuqs/server'
import RepositoryTreePage, {
  type RepositoryTreePageProps,
} from '@/components/pages/repository-tree-page'
import { searchParamsCache } from '@/lib/search-params'

type PageProps = {
  searchParams: Promise<SearchParams>
} & RepositoryTreePageProps

export default async function Page({ searchParams, ...props }: PageProps) {
  await searchParamsCache.parse(searchParams)
  return <RepositoryTreePage {...props} />
}
