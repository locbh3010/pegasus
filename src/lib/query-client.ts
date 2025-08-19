'use client'

import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 2 minutes by default
      staleTime: 2 * 60 * 1000,
      // Data stays in cache for 5 minutes by default
      gcTime: 5 * 60 * 1000,
      // Retry failed requests 3 times with exponential backoff
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error && typeof error === 'object' && 'status' in error) {
          const status = error.status as number
          if (status >= 400 && status < 500) {
            return false
          }
        }
        return failureCount < 3
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus in development
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
      // Network mode for better offline handling
      networkMode: 'online',
    },
    mutations: {
      // Retry mutations once for network errors
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error && typeof error === 'object' && 'status' in error) {
          const status = error.status as number
          if (status >= 400 && status < 500) {
            return false
          }
        }
        return failureCount < 1
      },
      retryDelay: 1000,
      // Network mode for mutations
      networkMode: 'online',
    },
  },
})

// Query keys factory for consistent key management
export const queryKeys = {
  // Auth related queries
  auth: {
    user: ['auth', 'user'] as const,
    session: ['auth', 'session'] as const,
  },
  // Tasks related queries
  tasks: {
    all: ['tasks'] as const,
    byUser: (userId: string) => ['tasks', 'user', userId] as const,
    byId: (id: string) => ['tasks', 'id', id] as const,
  },
  // Projects related queries
  projects: {
    all: ['projects'] as const,
    lists: () => ['projects', 'list'] as const,
    list: (filters?: Record<string, unknown>) => ['projects', 'list', filters] as const,
    byUser: (userId: string) => ['projects', 'user', userId] as const,
    byId: (id: string) => ['projects', 'id', id] as const,
    members: {
      all: ['projects', 'members'] as const,
      byProject: (projectId: string) => ['projects', 'members', projectId] as const,
    },
  },
  // Users related queries
  users: {
    all: ['users'] as const,
    active: () => ['users', 'active'] as const,
    byId: (id: string) => ['users', 'id', id] as const,
    search: (query: string) => ['users', 'search', query] as const,
  },
} as const
