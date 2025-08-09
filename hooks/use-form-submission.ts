'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { logger } from '@/lib/logger'

const GIT_SUFFIX_REGEX = /\.git$/
const TRAILING_SLASH_REGEX = /\/$/

export function useFormSubmission() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (
    e: React.FormEvent,
    repoUrl: string,
    selectedBranch: string,
    isPrivateChat: boolean,
  ) => {
    e.preventDefault()

    if (!(repoUrl && selectedBranch)) {
      return
    }

    setIsSubmitting(true)

    try {
      // Extract owner and repo from URL
      const urlParts = repoUrl
        .replace(GIT_SUFFIX_REGEX, '')
        .replace(TRAILING_SLASH_REGEX, '')
        .split('/')
      const owner = urlParts.at(-2)
      const repo = urlParts.at(-1)

      if (owner && repo) {
        const params = new URLSearchParams()
        if (isPrivateChat) {
          params.set('private', 'true')
        }
        const queryString = params.toString()
        const url = `/${owner}/${repo}/tree/${selectedBranch}${queryString ? `?${queryString}` : ''}`
        router.push(url)
      }
    } catch (formError) {
      logger.error(`Error submitting form: ${formError}`)
      toast.error('An error occurred')
      setIsSubmitting(false)
    }
  }

  return {
    isSubmitting,
    handleSubmit,
  }
}
