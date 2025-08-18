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
        console.log('Processing OAuth callback...')
        console.log('Current URL:', window.location.href)

        // First, validate that we have OAuth parameters in the URL
        const hasOAuthParams =
          window.location.hash.includes('access_token') || window.location.search.includes('code=')

        if (!hasOAuthParams) {
          console.log('No OAuth parameters found in URL, checking for existing session...')

          // Check if there's an existing valid session
          const { data, error } = await supabase.auth.getSession()

          if (error || !data.session?.user) {
            console.log('No valid session found, redirecting to sign-in')
            setIsProcessing(false)
            router.replace('/auth/signin?error=no_session')
            return
          }

          // If we have a valid session, redirect to dashboard
          const redirectTo = searchParams.get('redirect_to') || '/dashboard'
          setIsProcessing(false)
          router.replace(redirectTo)
          return
        }

        // Use Supabase's built-in session handling which automatically processes OAuth callbacks
        // This handles both hash fragments and query parameters from OAuth providers
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('OAuth callback error:', error)
          setIsProcessing(false)
          router.replace('/auth/signin?error=oauth_error')
          return
        }

        if (data.session?.user) {
          console.log('OAuth authentication successful:', data.session.user.id)

          // Validate that the session is actually valid by checking expiry
          if (data.session.expires_at) {
            const expiryTime = new Date(data.session.expires_at).getTime()
            const currentTime = Date.now()

            if (currentTime >= expiryTime) {
              console.log('Session expired, attempting refresh...')
              const { error: refreshError } = await supabase.auth.refreshSession()

              if (refreshError) {
                console.error('Failed to refresh expired session:', refreshError)
                setIsProcessing(false)
                router.replace('/auth/signin?error=session_expired')
                return
              }
            }
          }

          // Small delay to ensure session is properly established
          await new Promise((resolve) => setTimeout(resolve, 500))

          // Get redirect URL from search params or default to dashboard
          const redirectTo = searchParams.get('redirect_to') || '/dashboard'

          setIsProcessing(false)
          router.replace(redirectTo)
          return
        }

        // If no session found, wait a bit longer and try again
        // Sometimes OAuth processing takes a moment
        console.log('No session found, waiting and retrying...')
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const { data: retryData, error: retryError } = await supabase.auth.getSession()

        if (retryError) {
          console.error('Retry session error:', retryError)
          setIsProcessing(false)
          router.replace('/auth/signin?error=session_error')
          return
        }

        if (retryData.session?.user) {
          console.log('OAuth authentication successful on retry:', retryData.session.user.id)

          // Validate the retry session as well
          if (retryData.session.expires_at) {
            const expiryTime = new Date(retryData.session.expires_at).getTime()
            const currentTime = Date.now()

            if (currentTime >= expiryTime) {
              console.log('Retry session expired, redirecting to sign-in')
              setIsProcessing(false)
              router.replace('/auth/signin?error=session_expired')
              return
            }
          }

          // Get redirect URL from search params or default to dashboard
          const redirectTo = searchParams.get('redirect_to') || '/dashboard'

          setIsProcessing(false)
          router.replace(redirectTo)
          return
        }

        // If we get here, no session was found after retry
        console.error('No session found in callback after retry')
        setIsProcessing(false)
        router.replace('/auth/signin?error=no_session')
      } catch (error) {
        console.error('Unexpected error in auth callback:', error)
        setIsProcessing(false)
        router.replace('/auth/signin?error=unexpected_error')
      }
    }

    // Add a small delay to ensure URL parameters are processed
    const timer = setTimeout(handleAuthCallback, 200)

    return () => clearTimeout(timer)
  }, [router, supabase.auth, searchParams])

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
