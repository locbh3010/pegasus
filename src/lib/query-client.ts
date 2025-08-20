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
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Refetch on window focus in development
            refetchOnWindowFocus: false,
            // Refetch on reconnect
            refetchOnReconnect: true,
            // Don't refetch on mount if data is fresh
            refetchOnMount: false,
            // Network mode for better offline handling
            networkMode: 'online',
            retry: false,
        },
        mutations: {
            // Retry mutations once for network errors
            retry: false,
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
