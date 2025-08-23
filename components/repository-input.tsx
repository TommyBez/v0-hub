'use client'

import { SiGithub } from '@icons-pack/react-simple-icons'
import { useQueryClient } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useValidateGithubUrl } from '@/hooks/use-validate-github-url'
import { repositoryUrlParser } from '@/lib/search-params'

export default function RepositoryInput() {
  const validateGithubRepoUrlSchema = useValidateGithubUrl()
  const [repositoryUrl, setRepositoryUrl] = useQueryState(
    'repositoryUrl',
    repositoryUrlParser.withOptions({ shallow: false }),
  )
  const [inputValue, setInputValue] = useState('')
  const [isValidUrl, setIsValidUrl] = useState(true)
  const debouncedValue = useDebouncedValue(inputValue, 1000)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (debouncedValue === '') {
      return
    }

    let cancelled = false

    const validate = async () => {
      // Ignore if stale or effect was cleaned up
      if (cancelled) {
        return true
      }
      const result =
        await validateGithubRepoUrlSchema.safeParseAsync(debouncedValue)

      if (result.success) {
        if (result.data !== repositoryUrl) {
          setRepositoryUrl(result.data)
        }
        setIsValidUrl(true)
      } else {
        setIsValidUrl(false)
      }
    }

    validate()
    return () => {
      cancelled = true
    }
  }, [
    debouncedValue,
    setRepositoryUrl,
    validateGithubRepoUrlSchema,
    repositoryUrl,
  ])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const queryState = queryClient.getQueryState(['validate-github-repo-url'])
    if (queryState) {
      queryClient.cancelQueries({ queryKey: ['validate-github-repo-url'] })
    }
    setInputValue(e.target.value)
  }

  return (
    <div className="grid gap-2">
      <Label className="flex items-center gap-2 font-medium text-base">
        <SiGithub className="h-4 w-4" />
        GitHub Repository URL
      </Label>
      <Input
        className={`h-12 text-base ${!inputValue || isValidUrl ? '' : 'border-destructive focus-visible:ring-destructive'}`}
        onChange={handleInputChange}
        placeholder="https://github.com/vercel/next.js"
        type="url"
        value={inputValue}
      />
      <p
        className={`text-sm ${!inputValue || isValidUrl ? 'text-muted-foreground' : 'text-destructive'}`}
      >
        {!inputValue || isValidUrl
          ? 'Enter a public GitHub repository URL to start a v0 chat'
          : 'Please enter a valid GitHub repository URL (e.g., https://github.com/user/repo)'}
      </p>
    </div>
  )
}
