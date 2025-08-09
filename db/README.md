# Database Setup Guide

This project uses Drizzle ORM with Neon (PostgreSQL) for database management.

## Setup Instructions

1. **Create a Neon Database**
   - Sign up for a free account at [Neon](https://neon.tech)
   - Create a new project and database
   - Copy the connection string from the dashboard

2. **Set up Clerk Authentication**
   - Sign up for a free account at [Clerk](https://clerk.com)
   - Create a new application
   - Copy your API keys from the dashboard

3. **Configure Environment Variables**
   - Copy the `.env.example` file to `.env`
   - Add your Clerk API keys:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-key
   CLERK_SECRET_KEY=sk_test_your-key
   ```
   - Add your Neon database connection string:
   ```
   DATABASE_URL=postgresql://[user]:[password]@[neon-hostname]/[database-name]?sslmode=require
   ```

4. **Generate and Run Migrations**
   ```bash
   # Generate migrations from schema
   pnpm db:generate
   
   # Apply migrations to database
   pnpm db:push
   ```

5. **Database Management Commands**
   - `pnpm db:generate` - Generate migration files from schema changes
   - `pnpm db:migrate` - Run migrations (production)
   - `pnpm db:push` - Push schema changes directly (development)
   - `pnpm db:studio` - Open Drizzle Studio for database management

## Schema Overview

The database includes a `users` table with the following fields:
- `id` - UUID primary key (auto-generated)
- `email` - User's email address (unique, required)
- `clerkId` - Clerk authentication ID (unique, required)
- `v0token` - Optional v0 API key
- `createdAt` - Timestamp of creation
- `updatedAt` - Timestamp of last update

## Usage Examples

```typescript
import { createUser, getUserByClerkId, updateUserV0Token, findOrCreateUser } from '@/db/queries';

// Create a new user
const newUser = await createUser({
  email: 'user@example.com',
  clerkId: 'clerk_user_id',
  v0token: 'optional_token'
});

// Get user by Clerk ID
const user = await getUserByClerkId('clerk_user_id');

// Find or create user (useful for authentication flows)
const user = await findOrCreateUser({
  clerkId: 'clerk_user_id',
  email: 'user@example.com',
  v0token: 'optional_token' // optional
});

// Update user's v0token
const updatedUser = await updateUserV0Token('clerk_user_id', 'new_token');
```

## Integration with Clerk

This database schema is designed to work with Clerk authentication. After a user signs in with Clerk, you can create a corresponding database record using the Clerk user ID.

Example middleware or API route:
```typescript
import { currentUser } from '@clerk/nextjs/server';
import { findOrCreateUser } from '@/db/queries';

const user = await currentUser();
if (user) {
  // This will find the user or create a new one if it doesn't exist
  const dbUser = await findOrCreateUser({
    clerkId: user.id,
    email: user.emailAddresses[0].emailAddress,
  });
}
```