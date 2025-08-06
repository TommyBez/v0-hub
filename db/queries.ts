import { eq, and } from 'drizzle-orm';
import { db, users, v0tokens, type NewUser, type User, type NewV0Token, type V0Token } from './index';
import { currentUser } from '@clerk/nextjs/server';
import { cache } from 'react';
import crypto from 'crypto';

// Encryption utilities
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const IV_LENGTH = 16;

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text: string): string {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Create a new user
export async function createUser(data: NewUser): Promise<User> {
  const [newUser] = await db.insert(users).values(data).returning();
  return newUser;
}

// Get a user by Clerk ID
export async function getUserByClerkId(clerkId: string): Promise<User | null> {
  const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId));
  return user || null;
}

// Get a user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user || null;
}

// Find or create a user by Clerk ID
export async function findOrCreateUser(data: {
  clerkId: string;
  email: string;
  v0token?: string;
}): Promise<User> {
  // First, try to find the user
  const existingUser = await getUserByClerkId(data.clerkId);
  
  if (existingUser) {
    return existingUser;
  }
  
  // If not found, create a new user
  return createUser({
    clerkId: data.clerkId,
    email: data.email,
    v0token: data.v0token,
  });
}

// Sync current Clerk user with database (combines currentUser + findOrCreateUser)
async function syncCurrentUser(): Promise<User | null> {
  try {
    const user = await currentUser();
    
    if (!user || !user.emailAddresses?.[0]?.emailAddress) {
      return null;
    }
    
    return findOrCreateUser({
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
    });
  } catch (error) {
    console.error('Error in syncCurrentUser:', error);
    return null;
  }
}

// Export cached version of syncCurrentUser
export const getCachedUser = cache(syncCurrentUser);

// Update user's v0token (legacy - kept for backwards compatibility)
export async function updateUserV0Token(clerkId: string, v0token: string): Promise<User | null> {
  const [updatedUser] = await db
    .update(users)
    .set({ v0token, updatedAt: new Date() })
    .where(eq(users.clerkId, clerkId))
    .returning();
  return updatedUser || null;
}

// Delete a user by Clerk ID
export async function deleteUser(clerkId: string): Promise<boolean> {
  const result = await db.delete(users).where(eq(users.clerkId, clerkId));
  return result.rowCount > 0;
}

// V0 Token Management Functions

// Create a new v0 token
export async function createV0Token(data: {
  userId: string;
  name: string;
  token: string;
}): Promise<V0Token> {
  const encryptedToken = encrypt(data.token);
  const [newToken] = await db.insert(v0tokens).values({
    userId: data.userId,
    name: data.name,
    token: encryptedToken,
  }).returning();
  return newToken;
}

// Get all tokens for a user
export async function getUserV0Tokens(userId: string): Promise<V0Token[]> {
  return db.select().from(v0tokens)
    .where(and(eq(v0tokens.userId, userId), eq(v0tokens.isActive, true)));
}

// Get a specific token by ID
export async function getV0TokenById(id: string, userId: string): Promise<V0Token | null> {
  const [token] = await db.select().from(v0tokens)
    .where(and(eq(v0tokens.id, id), eq(v0tokens.userId, userId)));
  return token || null;
}

// Get decrypted token value
export async function getDecryptedToken(id: string, userId: string): Promise<string | null> {
  const token = await getV0TokenById(id, userId);
  if (!token) return null;
  
  try {
    // Update last used timestamp
    await db.update(v0tokens)
      .set({ lastUsedAt: new Date() })
      .where(eq(v0tokens.id, id));
    
    return decrypt(token.token);
  } catch (error) {
    console.error('Error decrypting token:', error);
    return null;
  }
}

// Update a token
export async function updateV0Token(
  id: string,
  userId: string,
  data: { name?: string; token?: string; isActive?: boolean }
): Promise<V0Token | null> {
  const updateData: any = { updatedAt: new Date() };
  if (data.name !== undefined) updateData.name = data.name;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.token !== undefined) updateData.token = encrypt(data.token);
  
  const [updatedToken] = await db.update(v0tokens)
    .set(updateData)
    .where(and(eq(v0tokens.id, id), eq(v0tokens.userId, userId)))
    .returning();
  return updatedToken || null;
}

// Delete (soft delete) a token
export async function deleteV0Token(id: string, userId: string): Promise<boolean> {
  const result = await db.update(v0tokens)
    .set({ isActive: false, updatedAt: new Date() })
    .where(and(eq(v0tokens.id, id), eq(v0tokens.userId, userId)));
  return result.rowCount > 0;
}

// Migrate legacy token from users table to v0tokens table
export async function migrateLegacyToken(userId: string): Promise<V0Token | null> {
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user[0]?.v0token) return null;
  
  // Create new token entry
  const newToken = await createV0Token({
    userId,
    name: 'Default Token (Migrated)',
    token: user[0].v0token,
  });
  
  // Clear the legacy token
  await db.update(users)
    .set({ v0token: null, updatedAt: new Date() })
    .where(eq(users.id, userId));
  
  return newToken;
}