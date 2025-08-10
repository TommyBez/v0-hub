import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { users, chats } from './schema'

// During build time, we might not have DATABASE_URL
const databaseUrl = process.env.DATABASE_URL || 'postgresql://build:build@localhost/build'

const sql = neon(databaseUrl)

export const db = drizzle(sql, { schema: { users, chats } })

// Export all schemas and types
export * from './schema'
