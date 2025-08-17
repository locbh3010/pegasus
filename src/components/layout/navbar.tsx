'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Menu, User, LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AuthModal } from '@/features/auth/components/auth-modal'
import { NavbarProps } from '@/types'

export const Navbar = ({ onSidebarToggle, isSidebarOpen: _isSidebarOpen }: NavbarProps) => {
  const { data: session, status } = useSession()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  const handleAuthModalOpen = (mode: 'login' | 'register') => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <>
      <nav className="bg-card border-border fixed top-0 right-0 left-0 z-50 border-b">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {/* Sidebar toggle - only show when authenticated */}
            {session && (
              <Button variant="ghost" size="sm" onClick={onSidebarToggle} className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            )}

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <span className="text-primary-foreground text-sm font-bold">TM</span>
              </div>
              <span className="text-lg font-semibold">Task Manager</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="bg-muted h-8 w-8 animate-pulse rounded-full" />
            ) : session ? (
              /* Authenticated user menu */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <div className="bg-primary flex h-full w-full items-center justify-center rounded-full">
                        <User className="text-primary-foreground h-4 w-4" />
                      </div>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm leading-none font-medium">
                      {session.user?.name || 'User'}
                    </p>
                    <p className="text-muted-foreground text-xs leading-none">
                      {session.user?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Unauthenticated user buttons */
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleAuthModalOpen('login')}>
                  Login
                </Button>
                <Button size="sm" onClick={() => handleAuthModalOpen('register')}>
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  )
}
