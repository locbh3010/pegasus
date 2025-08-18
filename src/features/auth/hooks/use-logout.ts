'use client'

import { useState } from 'react'
import { useAuth } from '../components/auth-provider'
import { useRouter } from 'next/navigation'

interface UseLogoutOptions {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function useLogout(options?: UseLogoutOptions) {
  const [isLoading, setIsLoading] = useState(false)
  const { signOut } = useAuth()
  const router = useRouter()

  const logout = async () => {
    setIsLoading(true)
    try {
      await signOut()
      router.push('/')
      options?.onSuccess?.()
    } catch (_error) {
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
