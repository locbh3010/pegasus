'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { LoginCredentials } from '../types'

interface UseLoginOptions {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function useLogin(options?: UseLoginOptions) {
  const [isLoading, setIsLoading] = useState(false)

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      })

      if (result?.error) {
        options?.onError?.('Invalid email or password')
      } else {
        options?.onSuccess?.()
      }
    } catch (error) {
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
