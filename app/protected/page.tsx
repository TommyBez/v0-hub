import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/")
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-4">Protected Page</h1>
      <p className="text-muted-foreground">
        This page is only accessible to authenticated users.
      </p>
      <p className="mt-4">
        Your user ID is: <code className="text-sm bg-muted px-2 py-1 rounded">{userId}</code>
      </p>
    </div>
  )
}