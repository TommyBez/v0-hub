# Database Setup Guide

This project uses Drizzle ORM with Neon (PostgreSQL) for database management.

## Setup Instructions

1. **Create a Neon Database**
   - Sign up for a free account at [Neon](https://neon.tech)
   - Create a new project and database
   - Copy the connection string from the dashboard

2. **Configure Environment Variables**
   - Copy the connection string to your `.env` file:
   ```
   DATABASE_URL=postgresql://[user]:[password]@[neon-hostname]/[database-name]?sslmode=require
   ```

3. **Generate and Run Migrations**
   ```bash
   # Generate migrations from schema
   pnpm db:generate
   
   # Apply migrations to database
   pnpm db:push
   ```

4. **Database Management Commands**
   - `pnpm db:generate` - Generate migration files from schema changes
   - `pnpm db:migrate` - Run migrations (production)
   - `pnpm db:push` - Push schema changes directly (development)
   - `pnpm db:studio` - Open Drizzle Studio for database management

## Schema Overview

The database includes a `users` table with the following fields:
- `id` - UUID primary key (auto-generated)
- `email` - User's email address (unique, required)
- `clerkId` - Clerk authentication ID (unique, required)
- `v0token` - Optional v0 API token
- `createdAt` - Timestamp of creation
- `updatedAt` - Timestamp of last update

## Usage Examples

```typescript
import { createUser, getUserByClerkId, updateUserV0Token } from '@/db/queries';

// Create a new user
const newUser = await createUser({
  email: 'user@example.com',
  clerkId: 'clerk_user_id',
  v0token: 'optional_token'
});

// Get user by Clerk ID
const user = await getUserByClerkId('clerk_user_id');

// Update user's v0token
const updatedUser = await updateUserV0Token('clerk_user_id', 'new_token');
```

## Integration with Clerk

This database schema is designed to work with Clerk authentication. After a user signs in with Clerk, you can create a corresponding database record using the Clerk user ID.

Example middleware or API route:
```typescript
import { currentUser } from '@clerk/nextjs/server';
import { getUserByClerkId, createUser } from '@/db/queries';

const user = await currentUser();
if (user) {
  let dbUser = await getUserByClerkId(user.id);
  if (!dbUser) {
    dbUser = await createUser({
      email: user.emailAddresses[0].emailAddress,
      clerkId: user.id,
    });
  }
}
```