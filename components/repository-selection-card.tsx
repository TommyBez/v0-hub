'use client'

import { SiGithub } from '@icons-pack/react-simple-icons'
import { useEffect, useState } from 'react'
import RepositoryForm from '@/components/repository-form'
import TokenDialog from '@/components/token-dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useBranchFetcher } from '@/hooks/use-branch-fetcher'
import { useFormSubmission } from '@/hooks/use-form-submission'
import { useTokenManager } from '@/hooks/use-token-manager'

interface RepositorySelectionCardProps {
  title?: string
  description?: string
  disabled?: boolean
  showHeader?: boolean
}

export default function RepositorySelectionCard({
  title = 'Bootstrap Chat from GitHub',
  description = 'Initialize a new v0 chat instance from a public GitHub repository.',
  showHeader = true,
}: RepositorySelectionCardProps) {
  const [repoUrl, setRepoUrl] = useState('')

  const {
    branches,
    selectedBranch,
    setSelectedBranch,
    isFetchingBranches,
    branchError,
    handleRepoUrlChange,
  } = useBranchFetcher()

  const {
    isPrivateChat,
    showTokenDialog,
    setShowTokenDialog,
    handlePrivateChatToggle,
    handleTokenSaved,
  } = useTokenManager()

  const { isSubmitting, handleSubmit } = useFormSubmission()

  // Debounce repo URL changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleRepoUrlChange(repoUrl)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [repoUrl, handleRepoUrlChange])

  const onSubmit = (e: React.FormEvent) => {
    handleSubmit(e, repoUrl, selectedBranch, isPrivateChat)
  }

  return (
    <>
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
        <form onSubmit={onSubmit}>
          <CardContent>
            <RepositoryForm
              branchError={branchError}
              branches={branches}
              handlePrivateChatToggle={handlePrivateChatToggle}
              isFetchingBranches={isFetchingBranches}
              isPrivateChat={isPrivateChat}
              isSubmitting={isSubmitting}
              repoUrl={repoUrl}
              selectedBranch={selectedBranch}
              setRepoUrl={setRepoUrl}
              setSelectedBranch={setSelectedBranch}
              showHeader={showHeader}
            />
          </CardContent>
        </form>
      </Card>

      <TokenDialog
        onOpenChange={setShowTokenDialog}
        onTokenSaved={handleTokenSaved}
        open={showTokenDialog}
      />
    </>
  )
}
