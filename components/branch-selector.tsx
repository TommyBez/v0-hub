'use client'

import { useQuery } from '@tanstack/react-query'
import { GitBranch, Loader2 } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useEffect } from 'react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { branchParser, repositoryUrlParser } from '@/lib/search-params'
import { fetchGitHubBranches } from '@/services/github'

const fetchBranchesQuery = async (url: string) => {
  const result = await fetchGitHubBranches(url)
  return result.branches
}

const GITHUB_REPO_URL_REGEX =
  /^https:\/\/github\.com\/[^/]+\/[^/]+(?:\.git)?(?:\/)?$/

interface BranchSelectorProps {
  disabled?: boolean
}

export default function BranchSelector({ disabled }: BranchSelectorProps) {
  const [repositoryUrl] = useQueryState('repositoryUrl', repositoryUrlParser)
  const [branch, setBranch] = useQueryState('branch', branchParser)

  const {
    data: branches,
    isLoading: isFetchingBranches,
    error: branchError,
  } = useQuery({
    queryKey: ['branches', repositoryUrl],
    queryFn: () => fetchBranchesQuery(repositoryUrl),
    enabled:
      !!repositoryUrl && repositoryUrl.match(GITHUB_REPO_URL_REGEX) !== null,
    meta: {
      errorMessage: 'Failed to fetch branches',
      successMessage: (data: string[]) => {
        return `Found ${data.length} branch${data.length !== 1 ? 'es' : ''}`
      },
    },
  })

  useEffect(() => {
    const defaultBranch =
      branches?.find((b) => b === 'main') ??
      branches?.find((b) => b === 'master')
    if (defaultBranch) {
      setBranch(defaultBranch)
    }
  }, [branches, setBranch])

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
    if (branches?.length === 0) {
      return 'Enter repository URL first'
    }
    return 'Select a branch'
  }

  return (
    <div className="grid gap-2">
      <Label className="font-medium text-base">Branch</Label>
      <Select
        disabled={disabled || isFetchingBranches || branches?.length === 0}
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
          {branches?.map((branchName) => (
            <SelectItem key={branchName} value={branchName}>
              {branchName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {branchError && (
        <p className="mt-2 text-destructive text-sm">{branchError.message}</p>
      )}
      {branches?.length && branches?.length > 0 && (
        <p className="mt-2 text-muted-foreground text-sm">
          Found {branches?.length} branch
          {branches?.length !== 1 ? 'es' : ''}
        </p>
      )}
    </div>
  )
}
