'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { status } = useSession()
  const router = useRouter()

  // Redirect unauthenticated users to sign in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
      </div>
    )
  }

  // Don't render if not authenticated
  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-foreground mb-4 text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your dashboard. Content will be added here.
        </p>
      </div>
    </div>
  )
}
