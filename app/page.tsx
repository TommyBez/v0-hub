"use client"

import { useActionState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { bootstrapChatFromRepo } from "@/app/actions"
import RepositorySelectionCard from "@/components/repository-selection-card"
import ChatResultCard from "@/components/chat-result-card"

const initialState = {
  success: false,
  message: "",
  data: null as { id: string; url: string; demo: string; shortUrl?: string; shortDemoUrl?: string } | null,
}

export default function BootstrapPage() {
  const [state, formAction, isPending] = useActionState(bootstrapChatFromRepo, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const handleRepositorySubmit = async (repoUrl: string, branch: string) => {
    // Create FormData to pass to the action
    const formData = new FormData()
    formData.set("repoUrl", repoUrl)
    formData.set("branch", branch)
    
    const result = await formAction(formData)
    
    // If successful, navigate to the repository page
    if (result && result.success) {
      const match = repoUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)(?:\.git)?(?:\/)?$/)
      if (match) {
        const [, owner, repo] = match
        router.push(`/${owner}/${repo}/tree/${branch}`)
      }
    }
  }

  // Show toast notifications for form submission results
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message)
      } else {
        toast.error(state.message)
      }
    }
  }, [state])

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-2xl space-y-8">
        <RepositorySelectionCard
          onSubmit={handleRepositorySubmit}
          disabled={isPending}
        />

        {state.success && state.data && <ChatResultCard chatData={state.data} />}
      </div>
    </div>
  )
}
