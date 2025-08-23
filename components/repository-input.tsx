'use client'

import { SiGithub } from '@icons-pack/react-simple-icons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRepositoryInput } from '@/hooks/use-repository-input'

export default function RepositoryInput() {
  const { inputValue, isValidUrl, errorMessage, handleInputChange } =
    useRepositoryInput()

  return (
    <div className="grid gap-2">
      <Label className="flex items-center gap-2 font-medium text-base">
        <SiGithub className="h-4 w-4" />
        GitHub Repository URL
      </Label>
      <Input
        className={`h-12 text-base ${
          !inputValue || isValidUrl
            ? ''
            : 'border-destructive focus-visible:ring-destructive'
        }`}
        onChange={handleInputChange}
        placeholder="https://github.com/vercel/next.js"
        type="url"
        value={inputValue}
      />
      <p
        className={`text-sm ${
          !inputValue || isValidUrl
            ? 'text-muted-foreground'
            : 'text-destructive'
        }`}
      >
        {errorMessage}
      </p>
    </div>
  )
}
