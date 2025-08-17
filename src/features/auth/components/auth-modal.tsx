'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { AuthModalProps, LoginFormData, RegisterFormData } from '../types'

export const AuthModal = ({ isOpen, onClose, mode, onModeChange }: AuthModalProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const loginForm = useForm<LoginFormData>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
    },
  })

  const registerForm = useForm<RegisterFormData>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords do not match' : null,
    },
  })

  const handleLogin = async (values: LoginFormData) => {
    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (result?.error) {
        notifications.show({
          title: 'Login Failed',
          message: 'Invalid email or password',
          color: 'red',
        })
      } else {
        notifications.show({
          title: 'Success',
          message: 'Logged in successfully',
          color: 'green',
        })
        onClose()
        loginForm.reset()
      }
    } catch (_error) {
      notifications.show({
        title: 'Error',
        message: 'An unexpected error occurred',
        color: 'red',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (_values: RegisterFormData) => {
    setIsLoading(true)
    try {
      // TODO: Implement actual registration logic
      // For now, we'll just show a success message and switch to login
      notifications.show({
        title: 'Registration Successful',
        message: 'Please log in with your credentials',
        color: 'green',
      })
      registerForm.reset()
      onModeChange('login')
    } catch (_error) {
      notifications.show({
        title: 'Registration Failed',
        message: 'An error occurred during registration',
        color: 'red',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    loginForm.reset()
    registerForm.reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'login' ? 'Sign In' : 'Create Account'}</DialogTitle>
          <DialogDescription>
            {mode === 'login'
              ? 'Enter your credentials to access your account'
              : 'Create a new account to get started'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {mode === 'login' ? (
            <form onSubmit={loginForm.onSubmit(handleLogin)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...loginForm.getInputProps('email')}
                />
                {loginForm.errors.email && (
                  <p className="text-destructive text-sm">{loginForm.errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...loginForm.getInputProps('password')}
                />
                {loginForm.errors.password && (
                  <p className="text-destructive text-sm">{loginForm.errors.password}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          ) : (
            <form onSubmit={registerForm.onSubmit(handleRegister)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  {...registerForm.getInputProps('name')}
                />
                {registerForm.errors.name && (
                  <p className="text-destructive text-sm">{registerForm.errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...registerForm.getInputProps('email')}
                />
                {registerForm.errors.email && (
                  <p className="text-destructive text-sm">{registerForm.errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  {...registerForm.getInputProps('password')}
                />
                {registerForm.errors.password && (
                  <p className="text-destructive text-sm">{registerForm.errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  {...registerForm.getInputProps('confirmPassword')}
                />
                {registerForm.errors.confirmPassword && (
                  <p className="text-destructive text-sm">{registerForm.errors.confirmPassword}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          )}

          <Separator />

          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            </p>
            <Button
              variant="ghost"
              className="h-auto p-0"
              onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
            >
              {mode === 'login' ? 'Create one here' : 'Sign in here'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
