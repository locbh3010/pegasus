'use client'

import { useSession } from 'next-auth/react'

export function useAuthUser() {
  const { data: session, status } = useSession()

  return {
    user: session?.user || null,
    isLoading: status === 'loading',
    isError: false,
    error: null,
    isAuthenticated: !!session?.user,
    refetch: () => {}, // NextAuth handles session refresh automatically
  }
}
