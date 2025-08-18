'use client'

import { useAuth } from '../components/auth-provider'

export function useAuthUser() {
  const { user, loading } = useAuth()

  return {
    user,
    isLoading: loading,
    isError: false,
    error: null,
    isAuthenticated: !!user,
    refetch: () => {}, // Supabase handles session refresh automatically
  }
}
