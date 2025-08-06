# Clerk Authentication Setup

This Next.js application is configured to use Clerk for authentication. Follow these steps to complete the setup:

## 1. Create a Clerk Application

1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com) and sign up/sign in
2. Create a new application
3. Choose your authentication methods (Email, Google, GitHub, etc.)

## 2. Configure Environment Variables

Copy your API keys from the Clerk Dashboard and add them to your `.env.local` file:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## 3. Implementation Details

### Middleware Configuration
The `middleware.ts` file at the root uses `clerkMiddleware()` to protect routes:
- All routes are protected by default except static files
- API routes always run through the middleware

### Layout Integration
The `app/layout.tsx` wraps the entire application with `<ClerkProvider>`.

### Authentication Components
- **Header**: Contains Sign In/Sign Up buttons and UserButton
- **Protected Routes**: See `/app/protected/page.tsx` for server-side auth example
- **Client Components**: See `/components/user-profile.tsx` for client-side auth example

### Available Clerk Components
- `<SignInButton>` - Renders a sign-in button
- `<SignUpButton>` - Renders a sign-up button
- `<UserButton>` - Shows user avatar with dropdown menu
- `<SignedIn>` - Renders children only when signed in
- `<SignedOut>` - Renders children only when signed out

### Server-side Authentication
Use the `auth()` function from `@clerk/nextjs/server`:
```typescript
import { auth } from "@clerk/nextjs/server"

const { userId } = await auth()
```

### Client-side Authentication
Use the `useUser()` hook from `@clerk/nextjs`:
```typescript
import { useUser } from "@clerk/nextjs"

const { user, isSignedIn } = useUser()
```

## 4. Start Development

Run the development server:
```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) and test the authentication flow!