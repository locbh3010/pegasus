import { useMutation } from '@tanstack/react-query'
import { authServices } from '../services/auth.services'

export function useOAuth() {
  return useMutation({
    mutationFn: async (provider: 'google' | 'github') => {
      const response = await authServices.loginOAuth(provider)

      if (response.error) throw new Error(response.error.message)

      return response.data
    },
    onError: (error) => {
      console.error('useOAuth error:', error)
    },
  })
}
