import { getCachedUser } from "@/db/queries"
import { redirect } from "next/navigation"
import { TokenManager } from "@/components/token-manager"

export default async function TokensPage() {
  const user = await getCachedUser()
  
  if (!user) {
    redirect("/")
  }
  
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">v0 API Tokens</h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal v0 API tokens to create private chats. Your tokens are encrypted and stored securely.
          </p>
        </div>
        
        <TokenManager userId={user.id} />
      </div>
    </div>
  )
}