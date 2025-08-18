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
      const result = await signUp(credentials.email, credentials.password, credentials.username)

      if (result.error) {
        options?.onError?.(result.error)
      } else {
        options?.onSuccess?.()
      }
    } catch (_error) {
      options?.onError?.('Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    register,
    isLoading,
  }
}
