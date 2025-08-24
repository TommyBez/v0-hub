'use client'

import { SiGithub } from '@icons-pack/react-simple-icons'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRepositoryInput } from '@/hooks/use-repository-input'

export default function RepositoryInput() {
  const {
    inputValue,
    isValidUrl,
    errorMessage,
    handleInputChange,
    validationState,
  } = useRepositoryInput()

  return (
    <div className="grid gap-2">
      <Label className="flex items-center gap-2 font-medium text-base">
        <SiGithub className="h-4 w-4" />
        GitHub Repository URL
      </Label>
      <div className="relative">
        <Input
          className={`h-12 pr-10 text-base ${
            !inputValue || isValidUrl
              ? ''
              : 'border-destructive focus-visible:ring-destructive'
          }`}
          onChange={handleInputChange}
          placeholder="https://github.com/vercel/next.js"
          type="url"
          value={inputValue}
        />
        {validationState === 'validating' && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
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
