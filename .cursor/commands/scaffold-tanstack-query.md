# TanStack Query - Step-by-Step Integration Guide for React

This guide provides actionable steps to integrate TanStack Query into an existing React project. Follow each step in order.
Don't create package usage examples!

## Step 1: Install Dependencies

Run the appropriate command for your package manager:

```bash
# npm
npm install @tanstack/react-query @tanstack/react-query-devtools

# yarn
yarn add @tanstack/react-query @tanstack/react-query-devtools

# pnpm
pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

## Step 2: Create Query Client Configuration

Create a new file `lib/query-client.ts` (or `lib/query-client.js` for JavaScript):

```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()
```

## Step 3: Wrap Your App with QueryClientProvider

Find your root component file (usually `App.tsx`, `main.tsx`, or `index.tsx`) and update it:

```typescript
import React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './lib/query-client'

// Your existing imports...

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your existing app content */}
      {/* Add DevTools for development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
```

## Step 4: Verify the Integration

1. Start your development server
2. Open React Query DevTools (bottom right corner) to see the query client
3. The integration is ready for your first query

## Next.js Specific Setup

If you're using Next.js, follow these additional steps:

### For Next.js App Router (app directory)

1. Create `app/providers.tsx`:

```typescript
'use client'

'use client'

import {
  QueryClient,
  QueryClientProvider,
  isServer,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import * as React from 'react'
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'

function makeQueryClient() {
  return new QueryClient()
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (isServer) {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export function Providers(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        {props.children}
      </ReactQueryStreamedHydration>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

2. Update `app/layout.tsx`:

```typescript
import { QueryProviders } from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryProviders>{children}</Providers>
      </body>
    </html>
  )
}
```

### For Next.js Pages Router (pages directory)

Update `pages/_app.tsx`:

```typescript
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

### Important Next.js Considerations

1. **Client Components**: When using App Router, remember to add `'use client'` directive to components that use hooks
2. **SSR/SSG**: For server-side rendering, you'll need to set up hydration (covered in Next Steps)
3. **Route Handlers**: API routes in Next.js work perfectly as your data fetching endpoints
