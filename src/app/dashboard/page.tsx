'use client'

import { useAuth } from '@/features/auth/components/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {userDisplayName}!</h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your tasks today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-muted-foreground text-xs">+2 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-muted-foreground text-xs">+4 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-muted-foreground text-xs">-1 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-muted-foreground text-xs">-1 from last week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
          <CardDescription>Your most recently updated tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Complete project documentation</p>
                <p className="text-muted-foreground text-sm">Due tomorrow</p>
              </div>
              <div className="text-sm text-orange-600">In Progress</div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Review pull requests</p>
                <p className="text-muted-foreground text-sm">Due today</p>
              </div>
              <div className="text-sm text-green-600">Completed</div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Update user interface</p>
                <p className="text-muted-foreground text-sm">Due next week</p>
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
