import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  clerkId: text('clerk_id').notNull().unique(),
  v0token: text('v0token'), // Encrypted v0 API key
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Chats table
export const chats = pgTable('chats', {
  id: uuid('id').defaultRandom().primaryKey(),
  v0id: text('v0id').notNull().unique(),
  userId: uuid('user_id').notNull().references(() => users.id),
  owned: boolean('owned').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)
export const insertChatSchema = createInsertSchema(chats)
export const selectChatSchema = createSelectSchema(chats)

// TypeScript types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Chat = typeof chats.$inferSelect
export type NewChat = typeof chats.$inferInsert
