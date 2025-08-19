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
      await signIn(credentials.email, credentials.password)
      options?.onSuccess?.()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      options?.onError?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    login,
    isLoading,
  }
}
