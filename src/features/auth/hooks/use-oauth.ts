import { useMutation } from '@tanstack/react-query'
import { loginOAuth } from '../actions'

export function useOAuth() {
  return useMutation({
    mutationFn: async (provider: 'google' | 'github') => {
      const { error } = await loginOAuth(provider)
      if (error) throw new Error(error.message)
    },
    onError: (error) => {
      console.error('useOAuth error:', error)
    },
  })
}
