'use client'

import { useAuth } from '@/features/auth/components/auth-provider'

export default function DashboardPage() {
    const { user } = useAuth()

    const userDisplayName =
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email?.split('@')[0] ||
        'User'

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Welcome back, {userDisplayName}!
                </h1>
                <p className="text-muted-foreground">
                    Here&apos;s what&apos;s happening with your tasks today.
                </p>
            </div>
        </div>
    )
}
