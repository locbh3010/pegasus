'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '../components/auth-provider'

interface UseLogoutOptions {
  redirectTo?: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useLogout(options: UseLogoutOptions = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const { signOut } = useAuth()
  const router = useRouter()

  const { redirectTo = '/auth/signin', onSuccess, onError } = options

  const logout = async () => {
    setIsLoading(true)
    try {
      await signOut()

      // Call success callback if provided
      if (onSuccess) {
        onSuccess()
      }

      // Redirect after successful logout
      router.push(redirectTo)
    } catch (error) {
      console.error('useLogout error:', error)

      const logoutError = error instanceof Error ? error : new Error('Logout failed')

      // Call error callback if provided
      if (onError) {
        onError(logoutError)
      }

      // Still redirect to sign-in even if logout fails
      router.push(redirectTo)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    logout,
    isLoading,
  }
}
