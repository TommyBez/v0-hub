import { getCachedUser } from "@/db/queries"


export default async function UserPrefetch() {
  try {
    await getCachedUser()
  } catch (error) {
    console.error('Error prefetching user:', error)
  }
  return null
}