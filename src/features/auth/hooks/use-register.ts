'use client'

import { useMutation } from '@tanstack/react-query'
import { authServices } from '../services/auth.services'
import { RegisterCredentials } from '../types'

export function useRegister() {
  const {
    mutate: register,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: (credentials: RegisterCredentials) => authServices.register(credentials),
    retry: false,
  })

  return {
    register,
    isLoading: isPending,
    isError,
    error,
  }
}
