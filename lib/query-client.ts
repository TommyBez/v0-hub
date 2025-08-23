import { QueryClient } from '@tanstack/react-query'

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000, // 1 minute
        // How long inactive queries stay in cache before garbage collection
        gcTime: 5 * 60 * 1000, // 5 minutes (default)
        // Retry failed requests
        retry: 1,
        // Refetch on window focus
        refetchOnWindowFocus: false,
      },
      mutations: {
        // Retry failed mutations
        retry: 1,
      },
    },
  })
}
