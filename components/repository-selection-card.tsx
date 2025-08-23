import { Suspense } from 'react'
import BranchSelector from '@/components/branch-selector'
import BranchSelectorSkeleton from '@/components/branch-selector-skeleton'
import CreateChatButton from '@/components/create-chat-button'
import PrivateChatToggle from '@/components/private-chat-toggle'
import RepositoryInput from '@/components/repository-input'
import RepositoryInputSkeleton from '@/components/repository-input-skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { fetchGitHubBranches } from '@/lib/github-client'
import { searchParamsCache } from '@/lib/search-params'

export default function RepositorySelectionCard() {
  const repositoryUrl = searchParamsCache.get('repositoryUrl')

  const repositoryBranchesPromise = repositoryUrl
    ? fetchGitHubBranches(repositoryUrl)
    : null

  return (
    <Card className="relative overflow-hidden border-primary/20 shadow-primary/5 shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      <CardContent>
        <div className="relative space-y-4">
          <Suspense fallback={<RepositoryInputSkeleton />}>
            <RepositoryInput disabled={!!repositoryUrl} />
          </Suspense>
          <Suspense fallback={<BranchSelectorSkeleton />}>
            <BranchSelector branchesPromise={repositoryBranchesPromise} />
          </Suspense>
          <div className="space-y-4 border-t pt-4">
            <PrivateChatToggle />
          </div>
          <div className="relative mt-6">
            <CreateChatButton />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
