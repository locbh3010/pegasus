'use client'

import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLogout } from '../hooks/use-logout'

interface LogoutButtonProps {
  onSuccess?: () => void
  onError?: (error: string) => void
  variant?:
    | 'primary'
    | 'mono'
    | 'destructive'
    | 'secondary'
    | 'outline'
    | 'dashed'
    | 'ghost'
    | 'dim'
    | 'foreground'
    | 'inverse'
  size?: 'lg' | 'md' | 'sm' | 'icon'
  className?: string
  showIcon?: boolean
  children?: React.ReactNode
}

export function LogoutButton({
  onSuccess,
  onError,
  variant = 'outline',
  size = 'md',
  className,
  showIcon = true,
  children,
}: LogoutButtonProps) {
  const { logout, isLoading } = useLogout({
    onSuccess: () => {
      onSuccess?.()
    },
    onError: (error) => {
      onError?.(error)
    },
  })

  const handleLogout = () => {
    logout()
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
    >
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {children || (isLoading ? 'Signing Out...' : 'Sign Out')}
    </Button>
  )
}
