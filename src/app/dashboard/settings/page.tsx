'use client'

import { useEffect } from 'react'
import { useAuth } from '@/features/auth/components/auth-provider'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect unauthenticated users to sign in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    }
  }, [user, loading, router])

  // Show loading state while checking authentication
  if (loading) {
    return <div />
  }

  // Don't render if not authenticated
  if (!user) {
    return null
  }

  return <div />
}
