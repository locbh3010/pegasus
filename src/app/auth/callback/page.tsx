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
      } catch (_error) {
        router.replace('/auth/signin?error=callback_error')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="border-primary border-t-primary/20 mx-auto h-8 w-8 animate-spin rounded-full border-4" />
        <h2 className="text-foreground text-xl font-semibold">Processing authentication...</h2>
        <p className="text-muted-foreground">Please wait while we complete your sign-in.</p>
      </div>
    </div>
  )
}
