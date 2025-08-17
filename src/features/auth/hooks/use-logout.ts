'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'

interface UseLogoutOptions {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function useLogout(options?: UseLogoutOptions) {
  const [isLoading, setIsLoading] = useState(false)

  const logout = async () => {
    setIsLoading(true)
    try {
      await signOut({ callbackUrl: '/' })
      options?.onSuccess?.()
    } catch (error) {
      options?.onError?.('Failed to logout')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    logout,
    isLoading,
  }
}
