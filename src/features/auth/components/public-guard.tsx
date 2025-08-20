'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from './auth-provider'

export default function PublicGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { loading, user } = useAuth()

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard')
  }, [loading, user, router])

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
      </div>
    )
  }
  return <>{children}</>
}
