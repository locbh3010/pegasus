'use client'

import { useState } from 'react'
import { useAuth } from '../components/auth-provider'
import { RegisterCredentials } from '../types'

interface UseRegisterOptions {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function useRegister(options?: UseRegisterOptions) {
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true)
    try {
      await signUp(credentials.email, credentials.password)
      options?.onSuccess?.()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      options?.onError?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    register,
    isLoading,
  }
}
