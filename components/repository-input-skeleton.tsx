import { SiGithub } from '@icons-pack/react-simple-icons'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

export default function RepositoryInputSkeleton() {
  return (
    <div className="grid gap-2">
      <Label className="flex items-center gap-2 font-medium text-base">
        <SiGithub className="h-4 w-4" />
        GitHub Repository URL
      </Label>
      <div className="h-12 w-full rounded-md border border-input bg-background px-3 py-2">
        <Skeleton className="h-4 w-48" />
      </div>
      <p className="text-muted-foreground text-sm">
        Enter a public GitHub repository URL to start a v0 chat
      </p>
    </div>
  )
}
