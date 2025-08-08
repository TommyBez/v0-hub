import { Suspense } from 'react'
import {
  type ChatCreationResult,
  createV0Chat,
  createV0ChatWithToken,
} from '@/app/actions'
import ChatResultCard from '@/components/chat-result-card'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
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

  const fullBranchName = branch.join('/')
  const repoUrl = `https://github.com/${user}/${repository}`
  const isPrivate = searchParamsData.private === 'true'

  const basePromise: Promise<ChatCreationResult> = isPrivate
    ? createV0ChatWithToken(repoUrl, fullBranchName, true)
    : createV0Chat(repoUrl, fullBranchName)

  const chatResultPromise: Promise<{
    chatData: ChatCreationResult | null
    error: string | null
  }> = basePromise
    .then((chatData) => ({ chatData, error: null }))
    .catch((err) => {
      const message = err instanceof Error ? err.message : 'Failed to bootstrap chat'
      logger.error(`Error bootstrapping chat: ${err}`)
      return { chatData: null, error: message }
    })

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4 dark:bg-gray-950">
      <div className="w-full max-w-2xl">
        <Suspense
          fallback={
            <Card className="fade-in-50 animate-in">
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-7 w-32" />
                </CardTitle>
                <CardDescription>
                  <Skeleton className="mt-1 h-4 w-80" />
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-10 w-10" />
                  </div>
                </div>
              </CardContent>
            </Card>
          }
        >
          <ChatResultCard chatResultPromise={chatResultPromise} isPrivate={isPrivate} />
        </Suspense>
      </div>
    </div>
  )
}
