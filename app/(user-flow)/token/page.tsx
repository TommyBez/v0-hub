import { Suspense } from 'react'
import { getUserToken } from '@/app/actions'
import { TokenManager } from '@/components/token-manager'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

export default function TokenPage() {
  const tokenStatusPromise = getUserToken()

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="font-bold text-3xl tracking-tight">v0 API Key</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your personal v0 API key to create private chats. Your key is
            encrypted and stored securely.
          </p>
        </div>

        <Suspense
          fallback={
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  v0 API Key
                </CardTitle>
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
