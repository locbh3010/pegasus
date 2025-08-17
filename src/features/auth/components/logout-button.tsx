'use client'

import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLogout } from '../hooks/use-logout'

interface LogoutButtonProps {
  onSuccess?: () => void
  onError?: (error: string) => void
  variant?: 'primary' | 'mono' | 'destructive' | 'secondary' | 'outline' | 'dashed' | 'ghost' | 'dim' | 'foreground' | 'inverse'
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
  const logoutMutation = useLogout({
    onSuccess: () => {
      onSuccess?.()
    },
    onError: (error) => {
      onError?.(error.message)
    },
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
      className={className}
    >
      {showIcon && <LogOut className="w-4 h-4 mr-2" />}
      {children || (logoutMutation.isPending ? 'Signing Out...' : 'Sign Out')}
    </Button>
  )
}
