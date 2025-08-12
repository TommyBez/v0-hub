import { SiGithub } from '@icons-pack/react-simple-icons'
import { Suspense } from 'react'
import BranchSelector from '@/components/branch-selector'
import BranchSelectorSkeleton from '@/components/branch-selector-skeleton'
import CreateChatButton from '@/components/create-chat-button'
import PrivateChatToggle from '@/components/private-chat-toggle'
import RepositoryInput from '@/components/repository-input'
import RepositoryInputSkeleton from '@/components/repository-input-skeleton'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface RepositorySelectionCardProps {
  title?: string
  description?: string
  repositoryUrl?: string
  disabled?: boolean
  showHeader?: boolean
}

export default function RepositorySelectionCard({
  title = 'Bootstrap Chat from GitHub',
  description = 'Initialize a new v0 chat instance from a public GitHub repository.',
  showHeader = true,
  repositoryUrl,
}: RepositorySelectionCardProps) {
  return (
    <Card className="relative overflow-hidden border-primary/20 shadow-primary/5 shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      {showHeader && (
        <CardHeader className="relative">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3 backdrop-blur-sm">
              <SiGithub className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent>
        <div className={`relative space-y-4 ${showHeader ? '' : 'pt-6'}`}>
          <Suspense fallback={<RepositoryInputSkeleton />}>
            <RepositoryInput disabled={!!repositoryUrl} />
          </Suspense>
          <Suspense fallback={<BranchSelectorSkeleton />}>
            <BranchSelector />
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
