import { redirect } from 'next/navigation'
import { TokenManager } from '@/components/token-manager'
import { getCachedUser } from '@/db/queries'

export default async function TokensPage() {
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
            Manage your personal v0 API token to create private chats. Your
            token is encrypted and stored securely.
          </p>
        </div>

        <TokenManager />
      </div>
    </div>
  )
}
