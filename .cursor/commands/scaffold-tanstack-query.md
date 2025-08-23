# TanStack Query - Step-by-Step Integration Guide for React

This guide provides actionable steps to integrate TanStack Query into an existing React project. Follow each step in order.

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
