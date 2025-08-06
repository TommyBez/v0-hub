import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Create a placeholder database connection for build time
const databaseUrl = process.env.DATABASE_URL || 'postgresql://user:pass@host/db';

// Only warn in development/production runtime, not during build
if (!process.env.DATABASE_URL && process.env.NODE_ENV !== 'production') {
  console.warn('DATABASE_URL is not set. Database operations will fail.');
}

const sql = neon(databaseUrl);

export const db = drizzle(sql, { schema });

// Export all schemas and types
export * from './schema';