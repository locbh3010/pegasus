'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authServices } from '../services/auth.services'

export function useLogout() {
  const router = useRouter()

  return useMutation({
    mutationFn: async () => {
      const response = await authServices.logout()
      if (response.error) throw new Error(response.error.message)
    },
    onSuccess: () => router.push('/auth/signin'),
    onError: (error) => {
      console.error('useLogout error:', error)
    },
    retry: false,
  })
}
