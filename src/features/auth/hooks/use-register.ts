'use client'

import { useMutation } from '@tanstack/react-query'
import { authServices } from '../services/auth.services'
import { RegisterCredentials } from '../types'
import { useRouter } from 'next/navigation'

export function useRegister() {
  const router = useRouter()

  const {
    mutate: register,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: (credentials: RegisterCredentials) => authServices.register(credentials),
    onSuccess: () => router.replace('/dashboard'),
    retry: false,
  })

  return {
    register,
    isLoading: isPending,
    isError,
    error,
  }
}
