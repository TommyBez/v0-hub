import { createV0Chat, type ChatCreationResult } from "@/app/actions"
import ChatResultCard from "@/components/chat-result-card"

interface PageProps {
  params: Promise<{
    user: string
    repository: string
    branch: string
  }>
}

export default async function DynamicBootstrapPage({ params }: PageProps) {
  const { user, repository, branch } = await params

  // Construct the GitHub URL from params
  const repoUrl = `https://github.com/${user}/${repository}`

  let chatData: ChatCreationResult | null = null
  let error: string | null = null

  try {
    // Create the v0 chat
    chatData = await createV0Chat(repoUrl, branch)
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to bootstrap chat"
    console.error("Error bootstrapping chat:", err)
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-2xl">
        {error ? (
          <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
            <p className="text-sm font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          chatData && <ChatResultCard chatData={chatData} />
        )}
      </div>
    </div>
  )
}