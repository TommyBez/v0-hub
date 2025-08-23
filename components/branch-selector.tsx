'use client'

import { GitBranch } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { use, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { branchParser } from '@/lib/search-params'

interface BranchSelectorProps {
  disabled?: boolean
  branchesPromise: Promise<{
    branches: string[]
    defaultBranch: string | null
  }> | null
}

export default function BranchSelector({
  disabled,
  branchesPromise,
}: BranchSelectorProps) {
  const branchData = branchesPromise ? use(branchesPromise) : null
  const branches = branchData?.branches ?? []
  const [branch, setBranch] = useQueryState('branch', branchParser)

  useEffect(() => {
    if (branchData?.defaultBranch) {
      setBranch(branchData.defaultBranch)
    }
  }, [branchData?.defaultBranch, setBranch])

  const handleBranchChange = (newBranch: string) => {
    if (!newBranch) {
      return
    }
    setBranch(newBranch)
  }

  return (
    <div className="grid gap-2">
      <Label className="font-medium text-base">Branch</Label>
      <Select
        disabled={disabled || branches?.length === 0}
        onValueChange={handleBranchChange}
        value={branch}
      >
        <SelectTrigger className="h-12 w-full text-base">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            <SelectValue placeholder="Select a branch" />
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
      {!branches?.length && (
        <p className="mt-2 text-muted-foreground text-sm">
          Found {branches?.length} branch
          {branches?.length !== 1 ? 'es' : ''}
        </p>
      )}
    </div>
  )
}
