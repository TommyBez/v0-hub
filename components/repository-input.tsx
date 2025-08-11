'use client'

import { SiGithub } from '@icons-pack/react-simple-icons'
import { useQueryState } from 'nuqs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { repositoryUrlParser } from '@/lib/search-params'

interface RepositoryInputProps {
  disabled?: boolean
}

export default function RepositoryInput({ disabled }: RepositoryInputProps) {
  const [repositoryUrl, setRepositoryUrl] = useQueryState(
    'repositoryUrl',
    repositoryUrlParser,
  )

  return (
    <div className="grid gap-2">
      <Label className="flex items-center gap-2 font-medium text-base">
        <SiGithub className="h-4 w-4" />
        GitHub Repository URL
      </Label>
      <Input
        className="h-12 text-base"
        disabled={disabled}
        onChange={(e) => setRepositoryUrl(e.target.value)}
        placeholder="https://github.com/vercel/next.js"
        type="url"
        value={repositoryUrl}
      />
      <p className="text-muted-foreground text-sm">
        Enter a public GitHub repository URL to start a v0 chat
      </p>
    </div>
  )
}
