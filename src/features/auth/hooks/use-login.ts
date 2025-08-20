'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { login } from '../actions'
import { LoginCredentials } from '../types'

interface UseLoginOptions {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function useLogin(options?: UseLoginOptions) {
  const router = useRouter()

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { error } = await login(credentials.email, credentials.password)
      if (error) throw new Error(error.message)
    },
    onSuccess: () => router.replace('/dashboard'),
    retry: false,
  })
}
