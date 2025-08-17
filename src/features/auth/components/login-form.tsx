'use client'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useLogin } from '../hooks/use-login'
import type { LoginCredentials } from '../types'

const loginValidationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
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
  const { login, isLoading } = useLogin({
    onSuccess: () => {
      onSuccess?.()
    },
    onError: (error) => {
      onError?.(error)
    },
  })

  const handleSubmit = (values: LoginCredentials) => {
    login(values)
  }

  return (
    <Card className={`p-6 ${className || ''}`}>
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-foreground text-2xl font-bold">Sign In</h2>
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
                <label htmlFor="email" className="text-foreground mb-1 block text-sm font-medium">
                  Email Address *
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                  placeholder="Enter your email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-destructive mt-1 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="text-foreground mb-1 block text-sm font-medium"
                >
                  Password *
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                  placeholder="Enter your password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-destructive mt-1 text-sm"
                />
              </div>

              <Button type="submit" disabled={!isValid || !dirty || isLoading} className="w-full">
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Card>
  )
}
