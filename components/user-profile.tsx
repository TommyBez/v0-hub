"use client"

import { useUser } from "@clerk/nextjs"

export function UserProfile() {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!isSignedIn) {
    return <div>Not signed in</div>
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-2">User Profile</h3>
      <p className="text-sm text-muted-foreground">
        Welcome, {user.firstName || user.username || "User"}!
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        Email: {user.primaryEmailAddress?.emailAddress}
      </p>
    </div>
  )
}