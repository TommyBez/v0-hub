import { pgTable, text, timestamp, uuid, boolean, index } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  clerkId: text('clerk_id').notNull().unique(),
  v0token: text('v0token'), // Keep for backwards compatibility, will be migrated
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// New table for storing user v0 tokens
export const v0tokens = pgTable('v0tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(), // Friendly name for the token
  token: text('token').notNull(), // Encrypted token
  isActive: boolean('is_active').default(true).notNull(),
  lastUsedAt: timestamp('last_used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index('v0tokens_user_id_idx').on(table.userId),
  };
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  v0tokens: many(v0tokens),
}));

export const v0tokensRelations = relations(v0tokens, ({ one }) => ({
  user: one(users, {
    fields: [v0tokens.userId],
    references: [users.id],
  }),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertV0TokenSchema = createInsertSchema(v0tokens);
export const selectV0TokenSchema = createSelectSchema(v0tokens);

// TypeScript types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type V0Token = typeof v0tokens.$inferSelect;
export type NewV0Token = typeof v0tokens.$inferInsert;