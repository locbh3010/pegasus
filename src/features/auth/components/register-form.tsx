'use client'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRegister } from '../hooks/use-register'
import type { RegisterCredentials } from '@/types'

const registerValidationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
})

interface RegisterFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
  className?: string
}

export function RegisterForm({ onSuccess, onError, className }: RegisterFormProps) {
  const registerMutation = useRegister({
    onSuccess: () => {
      onSuccess?.()
    },
    onError: (error) => {
      onError?.(error.message)
    },
  })

  const handleSubmit = (values: RegisterCredentials) => {
    registerMutation.mutate(values)
  }

  return (
    <Card className={`p-6 ${className || ''}`}>
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
          <p className="text-muted-foreground">Sign up to get started with your account</p>
        </div>

        <Formik
          initialValues={{
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={registerValidationSchema}
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
                  autoComplete="new-password"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  placeholder="Create a password"
                />
                <ErrorMessage name="password" component="div" className="text-sm text-destructive mt-1" />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
                  Confirm Password *
                </label>
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  placeholder="Confirm your password"
                />
                <ErrorMessage name="confirmPassword" component="div" className="text-sm text-destructive mt-1" />
              </div>

              {registerMutation.isError && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {registerMutation.error?.message || 'Registration failed. Please try again.'}
                </div>
              )}

              <Button
                type="submit"
                disabled={!isValid || !dirty || registerMutation.isPending}
                className="w-full"
              >
                {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Card>
  )
}
