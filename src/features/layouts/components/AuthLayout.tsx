'use client'

import { useAuth } from '@/features/auth'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth()

  if (loading)
    return (
      <div className="bg-background flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="border-muted border-t-primary h-12 w-12 animate-spin rounded-full border-4"></div>
            <div className="border-primary/20 absolute inset-0 h-12 w-12 animate-pulse rounded-full border-4"></div>
          </div>
          <div className="text-center">
            <h3 className="text-foreground text-lg font-semibold">Loading...</h3>
            <p className="text-muted-foreground text-sm">
              Please wait while we prepare your workspace
            </p>
          </div>
        </div>
      </div>
    )

  return <>{children}</>
}
