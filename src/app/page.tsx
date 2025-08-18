'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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
    return <div />
  }

  // Don't render if user is authenticated
  if (status === 'authenticated') {
    return null
  }

  return <div />
}
