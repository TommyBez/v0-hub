'use client'

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { toast } from 'sonner'

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (_, query) => {
      if (query.meta?.errorMessage) {
        toast.error(query.meta.errorMessage as string)
      }
    },
    onSuccess: (_, query) => {
      if (query.meta?.successMessage) {
        if (typeof query.meta.successMessage === 'function') {
          toast.success(query.meta.successMessage(query.state.data))
        } else {
          toast.success(query.meta.successMessage as string)
        }
      }
    },
  }),
})

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
