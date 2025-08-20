'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authServices } from '../services/auth.services'
import { LoginCredentials } from '../types'

interface UseLoginOptions {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function useLogin(options?: UseLoginOptions) {
  const router = useRouter()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authServices.login(credentials.email, credentials.password),
    onSuccess: () => router.replace('/dashboard'),
    retry: false,
  })
}
