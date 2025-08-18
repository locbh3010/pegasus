'use client'

import { useEffect } from 'react'
import { useAuth } from '@/features/auth/components/auth-provider'
import { useRouter } from 'next/navigation'
import { DashboardNavbar } from '@/features/dashboard/components/dashboard-navbar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
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
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
      </div>
    )
  }

  // Don't render if not authenticated
  if (!user) {
    return null
  }

  return (
    <div className="bg-background min-h-screen">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
