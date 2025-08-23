'use client'

import { useQueryState } from 'nuqs'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { SafeParseSuccess } from 'zod'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useValidateGithubUrl } from '@/hooks/use-validate-github-url'
import { repositoryUrlParser } from '@/lib/search-params'

type ValidationState = 'idle' | 'validating' | 'valid' | 'invalid'

interface UseRepositoryInputResult {
  inputValue: string
  validationState: ValidationState
  isValidUrl: boolean
  errorMessage: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  repositoryUrl: string | null
}

export function useRepositoryInput(): UseRepositoryInputResult {
  const validateGithubRepoUrlSchema = useValidateGithubUrl()

  // URL query state
  const [repositoryUrl, setRepositoryUrl] = useQueryState(
    'repositoryUrl',
    repositoryUrlParser.withOptions({ shallow: false }),
  )

  // Local component state
  const [inputValue, setInputValue] = useState(repositoryUrl || '')
  const [validationState, setValidationState] =
    useState<ValidationState>('idle')

  // Debounced value for validation
  const debouncedValue = useDebouncedValue(inputValue, 500)

  // Ref to track current validation to prevent race conditions
  const validationRef = useRef<AbortController | null>(null)

  // Derived state
  const isValidUrl = validationState !== 'invalid'
  const errorMessage =
    validationState === 'invalid'
      ? 'Please enter a valid GitHub repository URL (e.g., https://github.com/user/repo)'
      : 'Enter a public GitHub repository URL to start a v0 chat'

  // Handle input changes
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value

      setInputValue(newValue)

      // Cancel any pending validation
      if (validationRef.current) {
        validationRef.current.abort()
        validationRef.current = null
      }

      // Reset validation state for immediate feedback
      if (newValue === '') {
        setValidationState('idle')
      } else if (validationState === 'invalid') {
        setValidationState('validating')
      }
    },
    [validationState],
  )

  // Handle debounced validation
  useEffect(() => {
    if (debouncedValue === '') {
      setValidationState('idle')
      return
    }

    // Create abort controller for this validation
    const abortController = new AbortController()
    validationRef.current = abortController

    const handleValidationSuccess = (result: SafeParseSuccess<string>) => {
      setValidationState('valid')
      // Only update URL if it's actually different
      const resultUrl = new URL(result.data)
      const currentUrl = repositoryUrl ? new URL(repositoryUrl) : null

      const shouldUpdate =
        !currentUrl ||
        resultUrl.origin + resultUrl.pathname !==
          currentUrl.origin + currentUrl.pathname

      if (shouldUpdate) {
        setRepositoryUrl(result.data)
      }
    }

    const handleValidationFailure = () => {
      if (!abortController.signal.aborted) {
        setValidationState('invalid')
      }
    }

    const validateAsync = async () => {
      try {
        setValidationState('validating')

        const result =
          await validateGithubRepoUrlSchema.safeParseAsync(debouncedValue)

        // Check if this validation was cancelled
        if (abortController.signal.aborted) {
          return
        }

        if (result.success) {
          handleValidationSuccess(result)
        } else {
          setValidationState('invalid')
        }
      } catch {
        handleValidationFailure()
      }
    }

    validateAsync()

    // Cleanup function
    return () => {
      abortController.abort()
      if (validationRef.current === abortController) {
        validationRef.current = null
      }
    }
  }, [
    debouncedValue,
    validateGithubRepoUrlSchema,
    repositoryUrl,
    setRepositoryUrl,
  ])

  return {
    inputValue,
    validationState,
    isValidUrl,
    errorMessage,
    handleInputChange,
    repositoryUrl,
  }
}
