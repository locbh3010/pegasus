'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const { status } = useSession()
  const router = useRouter()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
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

  // Don't render if user is authenticated
  if (status === 'authenticated') {
    return null
  }

  const handleSignIn = () => {
    router.push('/auth/signin')
  }

  return (
    <div className="bg-background min-h-screen">
      <main className="flex min-h-screen items-center justify-center">
        <div className="space-y-6 text-center">
          <h1 className="text-foreground text-4xl font-bold">Welcome to Pegasus</h1>
          <p className="text-muted-foreground">Please sign in to continue.</p>
          <Button onClick={handleSignIn}>Sign In</Button>
        </div>
      </main>
    </div>
  )
}
