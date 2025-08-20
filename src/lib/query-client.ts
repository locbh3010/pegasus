// app/get-query-client.ts
import { defaultShouldDehydrateQuery, isServer, QueryClient } from '@tanstack/react-query'

function makeQueryClient() {
    return new QueryClient({
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
            dehydrate: {
                // include pending queries in dehydration
                shouldDehydrateQuery: (query) =>
                    defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
                shouldRedactErrors: (error) => {
                    // We should not catch Next.js server errors
                    // as that's how Next.js detects dynamic pages
                    // so we cannot redact them.
                    // Next.js also automatically redacts errors for us
                    // with better digests.
                    return false
                },
            },
        },
    })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
    if (isServer) {
        // Server: always make a new query client
        return makeQueryClient()
    } else {
        // Browser: make a new query client if we don't already have one
        // This is very important, so we don't re-make a new client if React
        // suspends during the initial render. This may not be needed if we
        // have a suspense boundary BELOW the creation of the query client
        if (!browserQueryClient) browserQueryClient = makeQueryClient()
        return browserQueryClient
    }
}
