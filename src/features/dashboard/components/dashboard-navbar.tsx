'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Settings, CreditCard, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/features/auth/components/auth-provider'

interface DashboardNavbarProps {
  className?: string
}

export function DashboardNavbar({ className }: DashboardNavbarProps) {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleSignOut = async () => {
    // Option 1: Direct logout (current implementation)
    try {
      setIsLoggingOut(true)
      // Call signOut from AuthProvider
      await signOut()

      // Always redirect to sign-in page regardless of result
      // This ensures user doesn't get stuck in dashboard
      router.push('/auth/signin')
    } catch (error) {
      console.error('Dashboard sign out unexpected error:', error)

      // Even if there's an error, still redirect to sign-in
      router.push('/auth/signin')
    } finally {
      setIsLoggingOut(false)
    }

    // Option 2: Use logout page (uncomment to use)
    // router.push('/auth/logout')
  }

  const handleSettings = () => {
    router.push('/dashboard/settings')
  }

  const handleBilling = () => {
    // TODO: Implement billing page navigation
    // console.log('Navigate to billing page')
  }

  // Get user display information
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
    <nav
      className={`bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur ${className}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <span className="text-primary-foreground text-sm font-bold">P</span>
              </div>
              <span className="text-lg font-semibold">Pegasus</span>
            </div>
          </div>

          {/* Right side - User dropdown */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="hover:bg-accent relative h-10 w-auto px-3 py-2"
                  disabled={isLoggingOut}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userAvatarUrl || undefined} alt={userDisplayName} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden flex-col items-start md:flex">
                      <span className="text-sm leading-none font-medium">{userDisplayName}</span>
                      <span className="text-muted-foreground mt-1 text-xs leading-none">
                        {userEmail}
                      </span>
                    </div>
                    <ChevronDown className="text-muted-foreground h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                {/* User info section */}
                <div className="flex items-center space-x-3 p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={userAvatarUrl || undefined} alt={userDisplayName} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm leading-none font-medium">{userDisplayName}</p>
                    <p className="text-muted-foreground text-xs leading-none">{userEmail}</p>
                  </div>
                </div>

                <DropdownMenuSeparator />

                {/* Settings menu item */}
                <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>

                {/* Billing & Usage menu item */}
                <DropdownMenuItem onClick={handleBilling} className="cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing & Usage</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Logout menu item */}
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive focus:text-destructive cursor-pointer"
                  disabled={isLoggingOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isLoggingOut ? 'Signing out...' : 'Logout'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
