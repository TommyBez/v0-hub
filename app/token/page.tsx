import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { TokenManager } from '@/components/token-manager'
import { getCachedUser } from '@/db/queries'
import { getUserToken } from '@/app/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

export default async function TokenPage() {
  const tokenStatusPromise = getUserToken()
  const user = await getCachedUser()

  if (!user) {
    redirect('/')
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="font-bold text-3xl tracking-tight">v0 API Token</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your personal v0 API token to create private chats. Your token is encrypted and stored securely.
          </p>
        </div>

        <Suspense
          fallback={
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">v0 API Token</CardTitle>
                <CardDescription>
                  <Skeleton className="h-4 w-72" />
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-10" />
                  </div>
                  <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </CardContent>
            </Card>
          }
        >
          <TokenManager tokenStatusPromise={tokenStatusPromise} />
        </Suspense>
      </div>
    </div>
  )
}