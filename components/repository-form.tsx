'use client'

import { Globe, Loader2, Lock } from 'lucide-react'
import BranchSelector from '@/components/branch-selector'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface RepositoryFormProps {
  repoUrl: string
  setRepoUrl: (url: string) => void
  branches: string[]
  selectedBranch: string
  setSelectedBranch: (branch: string) => void
  isFetchingBranches: boolean
  branchError: string
  isPrivateChat: boolean
  handlePrivateChatToggle: (checked: boolean) => void
  isSubmitting: boolean
  showHeader: boolean
}

export default function RepositoryForm({
  repoUrl,
  setRepoUrl,
  branches,
  selectedBranch,
  setSelectedBranch,
  isFetchingBranches,
  branchError,
  isPrivateChat,
  handlePrivateChatToggle,
  isSubmitting,
  showHeader,
}: RepositoryFormProps) {
  return (
    <>
      <div className={`relative space-y-4 ${showHeader ? '' : 'pt-6'}`}>
        <div className="space-y-2">
          <Label className="font-medium text-base" htmlFor="repoUrl">
            GitHub Repository URL
          </Label>
          <Input
            className="h-12 text-base"
            disabled={isSubmitting}
            id="repoUrl"
            name="repoUrl"
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/vercel/next.js"
            required
            type="url"
            value={repoUrl}
          />
        </div>

        <BranchSelector
          branchError={branchError}
          branches={branches}
          isFetchingBranches={isFetchingBranches}
          isSubmitting={isSubmitting}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
        />

        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label
                className="flex items-center gap-2 font-medium text-base"
                htmlFor="private-chat"
              >
                {isPrivateChat ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <Globe className="h-4 w-4" />
                )}
                {isPrivateChat ? 'Private Chat' : 'Public Chat'}
              </Label>
              <p className="text-muted-foreground text-sm">
                {isPrivateChat
                  ? 'Uses your personal v0 token'
                  : 'Uses the default v0 token'}
              </p>
            </div>
            <Switch
              checked={isPrivateChat}
              disabled={isSubmitting}
              id="private-chat"
              onCheckedChange={handlePrivateChatToggle}
            />
          </div>
        </div>
      </div>
      <div className="relative mt-6">
        <Button
          className="h-12 w-full font-semibold text-base transition-all hover:scale-[1.02]"
          disabled={isSubmitting || !selectedBranch || isFetchingBranches}
          size="lg"
          type="submit"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading your v0 chat...
            </>
          ) : (
            <>
              {isPrivateChat ? <Lock className="mr-2 h-5 w-5" /> : null}
              Create {isPrivateChat ? 'private' : 'v0'} chat
              <span className="ml-2">→</span>
            </>
          )}
        </Button>
      </div>
    </>
  )
}
