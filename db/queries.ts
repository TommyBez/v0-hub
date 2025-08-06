import { eq } from 'drizzle-orm';
import { db, users, type NewUser, type User } from './index';

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