'use client'

import { GitBranch, Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface BranchSelectorProps {
  branches: string[]
  selectedBranch: string
  setSelectedBranch: (branch: string) => void
  isFetchingBranches: boolean
  branchError: string
  isSubmitting: boolean
}

export default function BranchSelector({
  branches,
  selectedBranch,
  setSelectedBranch,
  isFetchingBranches,
  branchError,
  isSubmitting,
}: BranchSelectorProps) {
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
      <div className="relative">
        <Select
          disabled={isSubmitting || isFetchingBranches || branches.length === 0}
          onValueChange={setSelectedBranch}
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
      </div>
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
