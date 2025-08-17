'use client'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useLogin } from '../hooks/use-login'
import type { LoginCredentials } from '@/types'

const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

interface LoginFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
  className?: string
}

export function LoginForm({ onSuccess, onError, className }: LoginFormProps) {
  const loginMutation = useLogin({
    onSuccess: () => {
      onSuccess?.()
    },
    onError: (error) => {
      onError?.(error.message)
    },
  })

  const handleSubmit = (values: LoginCredentials) => {
    loginMutation.mutate(values)
  }

  return (
    <Card className={`p-6 ${className || ''}`}>
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Sign In</h2>
          <p className="text-muted-foreground">Enter your credentials to access your account</p>
        </div>

        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={loginValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid, dirty }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                  Email Address *
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  placeholder="Enter your email"
                />
                <ErrorMessage name="email" component="div" className="text-sm text-destructive mt-1" />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                  Password *
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  placeholder="Enter your password"
                />
                <ErrorMessage name="password" component="div" className="text-sm text-destructive mt-1" />
              </div>

              {loginMutation.isError && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {loginMutation.error?.message || 'Login failed. Please try again.'}
                </div>
              )}

              <Button
                type="submit"
                disabled={!isValid || !dirty || loginMutation.isPending}
                className="w-full"
              >
                {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Card>
  )
}
