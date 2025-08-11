'use client'

import { GitBranch, Loader2 } from 'lucide-react'
import { useQueryState } from 'nuqs'
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
import { branchParser, repositoryUrlParser } from '@/lib/search-params'

const GITHUB_REPO_URL_REGEX =
  /^https:\/\/github\.com\/[^/]+\/[^/]+(?:\.git)?(?:\/)?$/

interface BranchSelectorProps {
  disabled?: boolean
}

export default function BranchSelector({ disabled }: BranchSelectorProps) {
  const [repositoryUrl] = useQueryState('repositoryUrl', repositoryUrlParser)
  const [branch, setBranch] = useQueryState('branch', branchParser)

  const [branches, setBranches] = useState<string[]>([])
  const [isFetchingBranches, setIsFetchingBranches] = useState(false)
  const [branchError, setBranchError] = useState('')

  const fetchBranches = useCallback(
    async (url: string) => {
      setIsFetchingBranches(true)
      setBranchError('')
      setBranches([])
      setBranch('')

      try {
        const result = await fetchGitHubBranches(url)

        if (result.success && result.branches) {
          setBranches(result.branches)
          // Prioritize "main" over "master", then fall back to first branch
          const defaultBranch =
            result.branches.find((b) => b === 'main') ||
            result.branches.find((b) => b === 'master') ||
            result.branches[0]
          setBranch(defaultBranch)
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
    [setBranch],
  )

  // Fetch branches when repo URL changes
  useEffect(() => {
    if (repositoryUrl.match(GITHUB_REPO_URL_REGEX)) {
      const timeoutId = setTimeout(() => {
        fetchBranches(repositoryUrl)
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [repositoryUrl, fetchBranches])

  const handleBranchChange = (newBranch: string) => {
    if (!newBranch) {
      return
    }
    setBranch(newBranch)
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
    <div className="grid gap-2">
      <Label className="font-medium text-base">Branch</Label>
      <Select
        disabled={disabled || isFetchingBranches || branches.length === 0}
        onValueChange={handleBranchChange}
        value={branch}
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
          {branches.map((branchName) => (
            <SelectItem key={branchName} value={branchName}>
              {branchName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {branchError && (
        <p className="mt-2 text-destructive text-sm">{branchError}</p>
      )}
      {branches.length > 0 && (
        <p className="mt-2 text-muted-foreground text-sm">
          Found {branches.length} branch
          {branches.length !== 1 ? 'es' : ''}
        </p>
      )}
    </div>
  )
}
