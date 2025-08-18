'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Rocket } from 'lucide-react'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback with proper session management
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth callback error:', error)
          setIsProcessing(false)
          router.replace('/auth/signin?error=oauth_error')
          return
        }

        if (data.session?.user) {
          console.error('OAuth authentication successful:', data.session.user.id)

          // Small delay to ensure session is properly established
          await new Promise((resolve) => setTimeout(resolve, 500))

          // Get redirect URL from search params or default to dashboard
          const redirectTo = searchParams.get('redirect_to') || '/dashboard'

          setIsProcessing(false)
          router.replace(redirectTo)
        } else {
          console.error('No session found in callback')
          setIsProcessing(false)
          router.replace('/auth/signin?error=no_session')
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error)
        setIsProcessing(false)
        router.replace('/auth/signin?error=unexpected_error')
      }
    }

    // Add a small delay to ensure URL parameters are processed
    const timer = setTimeout(handleAuthCallback, 100)

    return () => clearTimeout(timer)
  }, [router, supabase.auth, searchParams, setIsProcessing])

  if (!isProcessing) {
    return null // Prevent flash of content during redirect
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <Rocket className="text-primary h-12 w-12 animate-spin" />
        </div>
        <div className="space-y-2">
          <h1 className="text-foreground text-2xl font-bold">Completing sign-in...</h1>
          <p className="text-muted-foreground">
            Please wait while we finish setting up your account.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-background flex min-h-screen items-center justify-center p-4">
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <Rocket className="text-primary h-12 w-12 animate-spin" />
            </div>
            <div className="space-y-2">
              <h1 className="text-foreground text-2xl font-bold">Loading...</h1>
              <p className="text-muted-foreground">Please wait while we process your request.</p>
            </div>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  )
}
