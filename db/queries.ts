import crypto from 'node:crypto'
import { currentUser } from '@clerk/nextjs/server'
import { eq, and } from 'drizzle-orm'
import { cache } from 'react'
import { logger } from '@/lib/logger'
import { db, type NewUser, type User, users, type Chat, type NewChat, chats } from './index'

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
  const result = await db.delete(users).where(eq(users.clerkId, clerkId))
  return result.rowCount > 0
}

// Chat queries
export const chatQueries = {
  // Get a chat by ID
  async getById(id: string): Promise<Chat | null> {
    const [chat] = await db.select().from(chats).where(eq(chats.id, id))
    return chat || null
  },

  // Get a chat by v0id
  async getByV0Id(v0id: string): Promise<Chat | null> {
    const [chat] = await db.select().from(chats).where(eq(chats.v0id, v0id))
    return chat || null
  },

  // Get all chats for a user
  async getUserChats(userId: string): Promise<Chat[]> {
    return db.select().from(chats).where(eq(chats.userId, userId))
  },

  // Create a new chat
  async create(data: NewChat): Promise<Chat> {
    const [newChat] = await db.insert(chats).values(data).returning()
    return newChat
  },

  // Update chat ownership
  async updateOwnership(id: string, owned: boolean): Promise<Chat | null> {
    const [updatedChat] = await db
      .update(chats)
      .set({ owned, updatedAt: new Date() })
      .where(eq(chats.id, id))
      .returning()
    return updatedChat || null
  },

  // Delete a chat
  async delete(id: string): Promise<boolean> {
    const result = await db.delete(chats).where(eq(chats.id, id))
    return result.rowCount > 0
  },

  // Get user's owned and public chats (separate queries for better performance)
  async getUserOwnedChats(userId: string): Promise<Chat[]> {
    return db.select().from(chats).where(and(eq(chats.userId, userId), eq(chats.owned, true)))
  },

  async getUserPublicChats(userId: string): Promise<Chat[]> {
    return db.select().from(chats).where(and(eq(chats.userId, userId), eq(chats.owned, false)))
  },
}

// Export the chats object for backward compatibility
export const chatsQueries = chatQueries

// Export chats with getById method
export const chats = {
  getById: chatQueries.getById,
  getByV0Id: chatQueries.getByV0Id,
  getUserChats: chatQueries.getUserChats,
  create: chatQueries.create,
  updateOwnership: chatQueries.updateOwnership,
  delete: chatQueries.delete,
  getUserOwnedChats: chatQueries.getUserOwnedChats,
  getUserPublicChats: chatQueries.getUserPublicChats,
}
