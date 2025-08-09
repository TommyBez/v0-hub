# v0hub

A Next.js application that creates v0 chat sessions from public GitHub repository URLs with support for private chats using personal v0 tokens.

## What it does

v0hub lets you paste a GitHub repository URL and create a v0 chat session for that codebase. This allows you to use v0's capabilities to explore and work with the code. 

### Key Features

- **Public Chats**: Create public v0 chats using the default API key
- **Private Chats**: Sign in to create private chats using your personal v0 api key
- **Secure Key Storage**: Your v0 API key is encrypted and stored securely
- **Branch Selection**: Automatically fetches and lets you select repository branches
 - **URL Shortening**: Removed. Previously used Dub; now we link directly to v0 URLs.

## Requirements

- Node.js 18+
- pnpm (or npm/yarn)
- Neon Database (PostgreSQL)
- Clerk account for authentication
- v0 API key from [v0.dev](https://v0.dev) (optional for public chats)
 

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd v0hub
   ```

2. Install dependencies:
   ```bash
   pnpm install --legacy-peer-deps
   ```

3. Create `.env.local` (see `.env.example` for all options):
   ```env
   # Database
   DATABASE_URL=your_neon_database_url
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # v0 API (optional - for public chats)
   V0_API_KEY=your_v0_api_key
   
   # Key Encryption
   ENCRYPTION_KEY=your_32_byte_hex_encryption_key  # Generate with: openssl rand -hex 32
   
    
   ```

4. Set up the database:
   ```bash
   pnpm db:generate
   pnpm db:push
   ```

5. Run the development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Usage

### Public Chats (No Sign-in Required)
1. Enter a public GitHub repository URL
2. Select a branch
3. Click "Create v0 chat" to create a public chat

### Private Chats (Sign-in Required)
1. Sign in with Clerk authentication
2. Add your v0 API key via the "API Key" page
3. Enter a GitHub repository URL
4. Toggle "Private Chat" option
5. Click "Create private chat"

## Managing Your API Key

1. Click "API Key" in the header (when signed in)
2. Enter your v0 API key
3. Your key is encrypted and stored securely
4. You can update or delete your key at any time

## Tech Stack

- Next.js 15.2.4
- TypeScript
- React 19
- Tailwind CSS
- shadcn/ui components
- Clerk for authentication
- Drizzle ORM
- Neon Database (PostgreSQL)
- v0-sdk

## Scripts

```bash
pnpm dev         # Development server
pnpm build       # Build for production
pnpm start       # Start production server
pnpm lint        # Run linter
pnpm db:generate # Generate database migrations
pnpm db:push     # Push migrations to database
pnpm db:studio   # Open Drizzle Studio
```

## Environment Variables

- `DATABASE_URL` - Required. Neon PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Required. Clerk publishable key
- `CLERK_SECRET_KEY` - Required. Clerk secret key
- `ENCRYPTION_KEY` - Required. 32-byte hex key for key encryption
- `V0_API_KEY` - Optional. Default v0 API key for public chats
 

## Security

- User API keys are encrypted using AES-256-CBC encryption
- Keys are never exposed in the UI (masked display)
- Each user can only access their own key
- HTTPS is required in production

## License

MIT
