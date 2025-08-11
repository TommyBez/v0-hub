'use client'

import { GitBranch, Loader2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { fetchGitHubBranches } from '@/app/actions'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const GITHUB_REPO_URL_REGEX =
  /^https:\/\/github\.com\/[^/]+\/[^/]+(?:\.git)?(?:\/)?$/

interface BranchSelectorProps {
  repoUrl: string
  isSubmitting: boolean
  onBranchChange: (branch: string) => void
}

export default function BranchSelector({
  repoUrl,
  isSubmitting,
  onBranchChange,
}: BranchSelectorProps) {
  const [branches, setBranches] = useState<string[]>([])
  const [selectedBranch, setSelectedBranch] = useState('')
  const [isFetchingBranches, setIsFetchingBranches] = useState(false)
  const [branchError, setBranchError] = useState('')

  const fetchBranches = useCallback(
    async (url: string) => {
      setIsFetchingBranches(true)
      setBranchError('')
      setBranches([])
      setSelectedBranch('')

      try {
        const result = await fetchGitHubBranches(url)

        if (result.success && result.branches) {
          setBranches(result.branches)
          // Prioritize "main" over "master", then fall back to first branch
          const defaultBranch =
            result.branches.find((branch) => branch === 'main') ||
            result.branches.find((branch) => branch === 'master') ||
            result.branches[0]
          setSelectedBranch(defaultBranch)
          onBranchChange(defaultBranch)
          toast.success(`Found ${result.branches.length} branches`)
        } else {
          setBranchError(result.error || 'Failed to fetch branches')
          toast.error(result.error || 'Failed to fetch branches')
        }
      } catch {
        setBranchError('Failed to fetch branches')
        toast.error('Failed to fetch branches')
      } finally {
        setIsFetchingBranches(false)
      }
    },
    [onBranchChange],
  )

  // Fetch branches when repo URL changes
  useEffect(() => {
    if (repoUrl.match(GITHUB_REPO_URL_REGEX)) {
      const timeoutId = setTimeout(() => {
        fetchBranches(repoUrl)
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [repoUrl, fetchBranches])

  const handleBranchChange = (branch: string) => {
    if (!branch) {
      return
    }
    setSelectedBranch(branch)
    onBranchChange(branch)
  }

  const getPlaceholder = () => {
    if (isFetchingBranches) {
      return 'Fetching branches...'
    }
    if (branches.length === 0) {
      return 'Enter repository URL first'
    }
    return 'Select a branch'
  }

  return (
    <div className="space-y-2">
      <Label className="font-medium text-base" htmlFor="branch">
        Branch
      </Label>

      <Select
        disabled={isSubmitting || isFetchingBranches || branches.length === 0}
        onValueChange={handleBranchChange}
        value={selectedBranch}
      >
        <SelectTrigger className="h-12 w-full text-base">
          <div className="flex items-center gap-2">
            {isFetchingBranches ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GitBranch className="h-4 w-4" />
            )}
            <SelectValue placeholder={getPlaceholder()} />
          </div>
        </SelectTrigger>
        <SelectContent>
          {branches.map((branch) => (
            <SelectItem key={branch} value={branch}>
              {branch}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {branchError && <p className="text-destructive text-sm">{branchError}</p>}
      {branches.length > 0 && (
        <p className="text-muted-foreground text-sm">
          Found {branches.length} branch
          {branches.length !== 1 ? 'es' : ''}
        </p>
      )}
    </div>
  )
}
