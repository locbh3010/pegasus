'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth callback error:', error)
          router.replace('/auth/signin?error=callback_error')
          return
        }

        if (data.session) {
          // Success - redirect to dashboard
          router.replace('/dashboard')
        } else {
          // No session - redirect to signin
          router.replace('/auth/signin')
        }
      } catch (error) {
        console.error('Callback processing error:', error)
        router.replace('/auth/signin?error=callback_error')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Processing authentication...</h2>
        <p className="mt-2 text-gray-600">Please wait while we complete your sign-in.</p>
      </div>
    </div>
  )
}
