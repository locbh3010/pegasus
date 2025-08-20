import { useMutation } from '@tanstack/react-query'
import { loginOAuth } from '../actions'

export function useOAuth() {
  return useMutation({
    mutationFn: async (provider: 'google' | 'github') => loginOAuth(provider),
    onError: (error) => {
      console.error('useOAuth error:', error)
    },
  })
}
