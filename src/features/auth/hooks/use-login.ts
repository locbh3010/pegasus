'use client'

import { useState } from 'react'
import { useAuth } from '../components/auth-provider'
import { LoginCredentials } from '../types'

interface UseLoginOptions {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function useLogin(options?: UseLoginOptions) {
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      const result = await signIn(credentials.email, credentials.password)

      if (result.error) {
        options?.onError?.(result.error)
      } else {
        options?.onSuccess?.()
      }
    } catch (_error) {
      options?.onError?.('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    login,
    isLoading,
  }
}
