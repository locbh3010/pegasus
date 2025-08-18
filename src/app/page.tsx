'use client'

import { useEffect } from 'react'
import { useAuth } from '@/features/auth/components/auth-provider'
import { useRouter } from 'next/navigation'
import LandingLayout from '@/features/layouts/components/LandingLayout'
import LandingPage from '@/features/landing/pages/LandingPage'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  // Show loading state while checking authentication
  if (loading) {
    return <div />
  }

  // Don't render if user is authenticated
  if (user) {
    return null
  }

  return (
    <LandingLayout>
      <LandingPage />
    </LandingLayout>
  )
}
