'use client'

import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { fetchGitHubBranches } from '@/app/actions'

const GITHUB_REPO_URL_REGEX =
  /^https:\/\/github\.com\/[^/]+\/[^/]+(?:\.git)?(?:\/)?$/

export function useBranchFetcher() {
  const [branches, setBranches] = useState<string[]>([])
  const [selectedBranch, setSelectedBranch] = useState('')
  const [isFetchingBranches, setIsFetchingBranches] = useState(false)
  const [branchError, setBranchError] = useState('')

  const fetchBranches = useCallback(async (url: string) => {
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
  }, [])

  const handleRepoUrlChange = useCallback(
    (repoUrl: string) => {
      if (repoUrl.match(GITHUB_REPO_URL_REGEX)) {
        fetchBranches(repoUrl)
      } else {
        setBranches([])
        setSelectedBranch('')
        setBranchError('')
      }
    },
    [fetchBranches],
  )

  return {
    branches,
    selectedBranch,
    setSelectedBranch,
    isFetchingBranches,
    branchError,
    handleRepoUrlChange,
  }
}
