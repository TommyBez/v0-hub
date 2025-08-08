import {
  type ChatCreationResult,
  createV0Chat,
  createV0ChatWithToken,
} from '@/app/actions'
import ChatResultCard from '@/components/chat-result-card'
import { logger } from '@/lib/logger'

interface PageProps {
  params: Promise<{
    user: string
    repository: string
    branch: string[]
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DynamicBootstrapPage({
  params,
  searchParams,
}: PageProps) {
  const { user, repository, branch } = await params
  const searchParamsData = await searchParams

  // Join the branch array with slashes to handle branch names with slashes
  const fullBranchName = branch.join('/')

  // Construct the GitHub URL from params
  const repoUrl = `https://github.com/${user}/${repository}`

  // Check if this should be a private chat
  const isPrivate = searchParamsData.private === 'true'

  let chatData: ChatCreationResult | null = null
  let error: string | null = null

  try {
    // Create the v0 chat with or without user token
    if (isPrivate) {
      chatData = await createV0ChatWithToken(repoUrl, fullBranchName, true)
    } else {
      chatData = await createV0Chat(repoUrl, fullBranchName)
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to bootstrap chat'
    logger.error(`Error bootstrapping chat: ${err}`)
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4 dark:bg-gray-950">
      <div className="w-full max-w-2xl">
        {error ? (
          <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
            <p className="font-medium text-sm">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          chatData && (
            <ChatResultCard chatData={chatData} isPrivate={isPrivate} />
          )
        )}
      </div>
    </div>
  )
}
