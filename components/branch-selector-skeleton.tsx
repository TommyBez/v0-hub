import { GitBranch } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

export default function BranchSelectorSkeleton() {
  return (
    <div className="grid gap-2">
      <Label className="font-medium text-base">Branch</Label>
      <div className="h-12 w-full rounded-md border border-input bg-background px-3 py-2">
        <div className="flex h-full items-center gap-2">
          <GitBranch className="h-4 w-4 text-muted-foreground" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Skeleton className="mt-2 h-4 w-24" />
    </div>
  )
}
