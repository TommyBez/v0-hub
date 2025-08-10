import crypto from 'node:crypto'
import { currentUser } from '@clerk/nextjs/server'
import { desc, eq } from 'drizzle-orm'
import { cache } from 'react'
import { logger } from '@/lib/logger'
import { getDb, type NewUser, type User, users, chats as chatsTable, type Chat, type NewChat } from './index'

// Encryption utilities
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
  ? Buffer.from(process.env.ENCRYPTION_KEY, 'hex')
  : crypto.randomBytes(32)
const IV_LENGTH = 16

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    ENCRYPTION_KEY as crypto.CipherKey,
    iv as crypto.BinaryLike,
  )
  const encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
  return `${iv.toString('hex')}:${encrypted}`
}

function decrypt(text: string): string {
  const textParts = text.split(':')
  const firstPart = textParts.shift()
  if (!firstPart) {
    return ''
  }
  const iv = Buffer.from(firstPart, 'hex')
  const encryptedText = textParts.join(':')
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    ENCRYPTION_KEY as crypto.CipherKey,
    iv as crypto.BinaryLike,
  )
  const decrypted =
    decipher.update(encryptedText, 'hex', 'utf8') + decipher.final('utf8')
  return decrypted
}

// Create a new user
export async function createUser(data: NewUser): Promise<User> {
  const db = getDb()
  const [newUser] = await db.insert(users).values(data).returning()
  return newUser
}

// Get a user by Clerk ID
export async function getUserByClerkId(clerkId: string): Promise<User | null> {
  const db = getDb()
  const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId))
  return user || null
}

// Get a user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  const db = getDb()
  const [user] = await db.select().from(users).where(eq(users.email, email))
  return user || null
}

// Find or create a user by Clerk ID
export async function findOrCreateUser(data: {
  clerkId: string
  email: string
  v0token?: string
}): Promise<User> {
  // First, try to find the user
  const existingUser = await getUserByClerkId(data.clerkId)

  if (existingUser) {
    return existingUser
  }

  // If not found, create a new user
  return createUser({
    clerkId: data.clerkId,
    email: data.email,
    v0token: data.v0token ? encrypt(data.v0token) : null,
  })
}

// Sync current Clerk user with database (combines currentUser + findOrCreateUser)
async function syncCurrentUser(): Promise<User | null> {
  try {
    const user = await currentUser()

    if (!user?.emailAddresses?.[0]?.emailAddress) {
      return null
    }

    return findOrCreateUser({
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
    })
  } catch (error) {
    logger.error(`Error in syncCurrentUser: ${error}`)
    return null
  }
}

// Export cached version of syncCurrentUser
export const getCachedUser = cache(syncCurrentUser)

// Update user's v0token
export async function updateUserV0Token(
  clerkId: string,
  v0token: string | null,
): Promise<User | null> {
  const db = getDb()
  const [updatedUser] = await db
    .update(users)
    .set({
      v0token: v0token ? encrypt(v0token) : null,
      updatedAt: new Date(),
    })
    .where(eq(users.clerkId, clerkId))
    .returning()
  return updatedUser || null
}

// Get decrypted v0 api key for a user
export async function getDecryptedV0Token(
  clerkId: string,
): Promise<string | null> {
  const user = await getUserByClerkId(clerkId)
  if (!user?.v0token) {
    return null
  }

  try {
    return decrypt(user.v0token)
  } catch (error) {
    logger.error(`Error decrypting token: ${error}`)
    return null
  }
}

// Delete a user by Clerk ID
export async function deleteUser(clerkId: string): Promise<boolean> {
  const db = getDb()
  const result = await db.delete(users).where(eq(users.clerkId, clerkId))
  return result.rowCount > 0
}

// Chats API
export const chats = {
  async create(data: NewChat): Promise<Chat> {
    const db = getDb()
    const [row] = await db.insert(chatsTable).values(data).returning()
    return row
  },

  async getById(id: string): Promise<Chat | null> {
    const db = getDb()
    const [row] = await db.select().from(chatsTable).where(eq(chatsTable.id, id))
    return row ?? null
  },

  async listByUser(userId: string): Promise<{ privateChats: Chat[]; publicChats: Chat[] }> {
    const db = getDb()
    const rows = await db
      .select()
      .from(chatsTable)
      .where(eq(chatsTable.userId, userId))
      .orderBy(desc(chatsTable.createdAt))

    const privateChats = rows.filter((r) => r.owned)
    const publicChats = rows.filter((r) => !r.owned)

    return { privateChats, publicChats }
  },
}
