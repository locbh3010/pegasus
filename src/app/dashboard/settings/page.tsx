'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
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
    return <div />
  }

  // Don't render if not authenticated
  if (status === 'unauthenticated') {
    return null
  }

  return <div />
}
