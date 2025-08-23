'use client'

import { SiGithub } from '@icons-pack/react-simple-icons'
import { useQueryState } from 'nuqs'
import { useDeferredValue, useEffect, useState } from 'react'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { repositoryUrlParser } from '@/lib/search-params'

const GITHUB_REPO_URL_REGEX =
  /^https:\/\/github\.com\/[^/]+\/[^/]+(?:\.git)?(?:\/)?$/

const validateGithubRepoUrlSchema = z
  .string()
  .regex(GITHUB_REPO_URL_REGEX, 'URL is not a valid GitHub repository URL')
  .refine(async (url) => {
    const response = await fetch(`/api/validate-github-repo-url/${url}`)
    const data = await response.json()
    return data.isValid
  }, 'URL is not a valid GitHub repository URL')

export default function RepositoryInput() {
  const [repositoryUrl, setRepositoryUrl] = useQueryState(
    'repositoryUrl',
    repositoryUrlParser.withOptions({ shallow: false }),
  )
  const [inputValue, setInputValue] = useState(repositoryUrl)
  const [isValidUrl, setIsValidUrl] = useState(true)
  const deferreddValue = useDeferredValue(inputValue)

  useEffect(() => {
    const validate = async () => {
      if (deferreddValue === '') {
        return
      }
      const result =
        await validateGithubRepoUrlSchema.safeParseAsync(deferreddValue)
      if (result.success) {
        setRepositoryUrl(result.data)
        setIsValidUrl(true)
      } else {
        setIsValidUrl(false)
      }
    }
    validate()
  }, [deferreddValue, setRepositoryUrl])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsValidUrl(true)
    setInputValue(e.target.value)
  }

  return (
    <div className="grid gap-2">
      <Label className="flex items-center gap-2 font-medium text-base">
        <SiGithub className="h-4 w-4" />
        GitHub Repository URL
      </Label>
      <Input
        className={`h-12 text-base ${isValidUrl ? '' : 'border-destructive focus-visible:ring-destructive'}`}
        onChange={handleInputChange}
        placeholder="https://github.com/vercel/next.js"
        type="url"
        value={inputValue}
      />
      <p
        className={`text-sm ${isValidUrl ? 'text-muted-foreground' : 'text-destructive'}`}
      >
        {isValidUrl
          ? 'Enter a public GitHub repository URL to start a v0 chat'
          : 'Please enter a valid GitHub repository URL (e.g., https://github.com/user/repo)'}
      </p>
    </div>
  )
}
