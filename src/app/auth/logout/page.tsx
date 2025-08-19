'use client'

import { useEffect } from 'react'
import { useAuth } from '@/features/auth/components/auth-provider'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
  const { signOut, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleLogout = async () => {
      try {
        console.error('🔥 Logout page: Processing logout...')

        if (user) {
          await signOut()
          console.error('🔥 Logout page: User signed out successfully')
        }

        // Always redirect to sign-in after logout attempt
        router.replace('/auth/signin')
      } catch (error) {
        console.error('Logout page error:', error)
        // Even if logout fails, redirect to sign-in
        router.replace('/auth/signin')
      }
    }

    handleLogout()
  }, [signOut, user, router])

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2" />
        <p className="text-muted-foreground">Signing out...</p>
      </div>
    </div>
  )
}
