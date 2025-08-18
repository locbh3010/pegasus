'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthUser } from '../hooks/use-auth-user'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  fallback?: React.ReactNode
}

export function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = '/auth/login',
  fallback,
}: AuthGuardProps) {
  const { isLoading, isAuthenticated } = useAuthUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo)
      } else if (!requireAuth && isAuthenticated) {
        // Redirect authenticated users away from auth pages
        router.push('/')
      }
    }
  }, [isLoading, isAuthenticated, requireAuth, redirectTo, router])

  // Show loading state
  if (isLoading) {
    return (
      fallback || (
        <div className="bg-background flex min-h-screen items-center justify-center">
          <div className="space-y-4 text-center">
            <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      )
    )
  }

  // Check auth requirements
  if (requireAuth && !isAuthenticated) {
    return null // Will redirect in useEffect
  }

  if (!requireAuth && isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}
