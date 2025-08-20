'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { logout } from '../actions'

export function useLogout() {
  const router = useRouter()

  return useMutation({
    mutationFn: async () => {
      const { error } = await logout()
      if (error) throw new Error(error.message)
    },
    onSuccess: () => router.push('/auth/signin'),
    onError: (error) => {
      console.error('useLogout error:', error)
    },
    retry: false,
  })
}
