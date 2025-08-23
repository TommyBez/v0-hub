import { useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { z } from 'zod'

const GITHUB_REPO_URL_REGEX =
  /^https:\/\/github\.com\/[^/]+\/[^/]+(?:\.git)?(?:\/)?$/

export function useValidateGithubUrl() {
  const queryClient = useQueryClient()

  const validateGithubRepoUrlSchema = useMemo(
    () =>
      z
        .string()
        .regex(
          GITHUB_REPO_URL_REGEX,
          'URL is not a valid GitHub repository URL',
        )
        .refine(async (url) => {
          const isValid = await queryClient.fetchQuery({
            queryKey: ['validate-github-repo-url', url],
            queryFn: async ({ signal }) => {
              const response = await fetch(
                `/api/validate-github-repo-url/${encodeURIComponent(url)}`,
                { signal },
              )
              if (!response.ok) {
                throw new Error('Failed to validate GitHub repository URL')
              }
              const result = await response.json()
              return result.isValid
            },
          })
          return isValid
        }, 'URL is not a valid GitHub repository URL'),
    [queryClient],
  )

  return validateGithubRepoUrlSchema
}
