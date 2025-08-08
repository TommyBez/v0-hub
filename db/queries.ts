import { currentUser } from '@clerk/nextjs/server'
import crypto from 'crypto'
import { eq } from 'drizzle-orm'
import { cache } from 'react'
import { db, type NewUser, type User, users } from './index'

// Encryption utilities
const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex')
const IV_LENGTH = 16

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv,
  )
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

function decrypt(text: string): string {
  const textParts = text.split(':')
  const iv = Buffer.from(textParts.shift()!, 'hex')
  const encryptedText = Buffer.from(textParts.join(':'), 'hex')
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv,
  )
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}

// Create a new user
export async function createUser(data: NewUser): Promise<User> {
  const [newUser] = await db.insert(users).values(data).returning()
  return newUser
}

// Get a user by Clerk ID
export async function getUserByClerkId(clerkId: string): Promise<User | null> {
  const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId))
  return user || null
}

// Get a user by email
export async function getUserByEmail(email: string): Promise<User | null> {
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

    if (!(user && user.emailAddresses?.[0]?.emailAddress)) {
      return null
    }

    return findOrCreateUser({
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
    })
  } catch (error) {
    console.error('Error in syncCurrentUser:', error)
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

// Get decrypted v0 token for a user
export async function getDecryptedV0Token(
  clerkId: string,
): Promise<string | null> {
  const user = await getUserByClerkId(clerkId)
  if (!(user && user.v0token)) return null

  try {
    return decrypt(user.v0token)
  } catch (error) {
    console.error('Error decrypting token:', error)
    return null
  }
}

// Delete a user by Clerk ID
export async function deleteUser(clerkId: string): Promise<boolean> {
  const result = await db.delete(users).where(eq(users.clerkId, clerkId))
  return result.rowCount > 0
}
