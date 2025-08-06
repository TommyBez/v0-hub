import { eq } from 'drizzle-orm';
import { db, users, type NewUser, type User } from './index';
import { currentUser } from '@clerk/nextjs/server';
import { cache } from 'react';

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

// Update user's v0token
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