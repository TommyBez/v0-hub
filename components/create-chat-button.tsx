'use client'

import { Loader2, Lock } from 'lucide-react'
import { useQueryStates } from 'nuqs'
import { Button } from '@/components/ui/button'
import { useFormSubmission } from '@/hooks/use-form-submission'
import { repositorySearchParams } from '@/lib/search-params'

const GITHUB_REPO_URL_REGEX =
  /^https:\/\/github\.com\/[^/]+\/[^/]+(?:\.git)?(?:\/)?$/

export default function CreateChatButton() {
  const [queryStates] = useQueryStates(repositorySearchParams)

  const { isSubmitting, handleSubmit } = useFormSubmission()

  const handleClick = (event: React.FormEvent) => {
    event.preventDefault()
    handleSubmit(
      event,
      queryStates.repositoryUrl,
      queryStates.branch,
      queryStates.privateChat,
    )
  }

  const isValidUrl = queryStates.repositoryUrl.match(GITHUB_REPO_URL_REGEX)
  const isDisabled = isSubmitting || !queryStates.branch || !isValidUrl

  return (
    <Button
      className="h-12 w-full font-semibold text-base transition-all hover:scale-[1.02]"
      disabled={isDisabled}
      onClick={handleClick}
      size="lg"
      type="button"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading your v0 chat...
        </>
      ) : (
        <>
          {queryStates.privateChat ? <Lock className="mr-2 h-5 w-5" /> : null}
          Create {queryStates.privateChat ? 'private' : 'v0'} chat
          <span className="ml-2">→</span>
        </>
      )}
    </Button>
  )
}
