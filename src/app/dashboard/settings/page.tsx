'use client'

import { useAuth } from '@/features/auth/components/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function SettingsPage() {
  const { user } = useAuth()

  const userDisplayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'User'

  const userEmail = user?.email || ''

  const userInitials = userDisplayName
    .split(' ')
    .map((name: string) => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const userAvatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your profile information and avatar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userAvatarUrl || undefined} alt={userDisplayName} />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm">
                  Change Avatar
                </Button>
                <p className="text-muted-foreground mt-2 text-sm">JPG, GIF or PNG. 1MB max.</p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  defaultValue={userDisplayName}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  defaultValue={userEmail}
                  disabled
                />
                <p className="text-muted-foreground text-sm">
                  Email cannot be changed. Contact support if you need to update your email.
                </p>
              </div>
            </div>

            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings and security.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-muted-foreground text-sm">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Change Password</p>
                <p className="text-muted-foreground text-sm">
                  Update your password to keep your account secure
                </p>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your experience and notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-muted-foreground text-sm">
                  Receive email updates about your tasks
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-muted-foreground text-sm">Choose your preferred theme</p>
              </div>
              <Button variant="outline" size="sm">
                System
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
