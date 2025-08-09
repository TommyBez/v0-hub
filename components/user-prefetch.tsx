import { getCachedUser } from '@/db/queries'
import { logger } from '@/lib/logger'

export default async function UserPrefetch() {
  try {
    await getCachedUser()
  } catch (error) {
    logger.error(`Error prefetching user: ${error}`)
  }
  return null
}
