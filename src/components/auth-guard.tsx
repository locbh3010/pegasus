'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthUser } from '@/features/auth/hooks/use-auth-user'

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
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
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
