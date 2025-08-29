"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

interface HttpError {
  status?: number
}

// Exponential backoff function
const exponentialBackoff = (failureCount: number, error: unknown): number => {
  // Don't retry for client errors (4xx) except 429 (rate limit)
  const httpError = error as HttpError
  if (httpError?.status && httpError.status >= 400 && httpError.status < 500 && httpError.status !== 429) {
    return 0 // Return 0 to prevent retry immediately
  }
  
  // Max 4 retries
  if (failureCount >= 4) {
    return 0
  }

  // Calculate delay with exponential backoff: 1s, 2s, 4s, 8s
  const delay = Math.min(1000 * (2 ** failureCount), 30000)
  return delay
}

const retryFunction = (failureCount: number, error: unknown) => {
  const delay = exponentialBackoff(failureCount, error)
  return delay > 0
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            refetchOnWindowFocus: false,
            retry: retryFunction,
            retryDelay: exponentialBackoff,
            networkMode: 'offlineFirst', // Try cache first when offline
          },
          mutations: {
            retry: (failureCount, error) => {
              // More conservative retry for mutations
              if (failureCount >= 2) return false
              return exponentialBackoff(failureCount, error) > 0
            },
            retryDelay: exponentialBackoff,
            networkMode: 'offlineFirst',
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}