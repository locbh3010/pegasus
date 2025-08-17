'use client'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRegister } from '../hooks/use-register'
import type { RegisterCredentials } from '../types'

const registerValidationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
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
  const { register, isLoading } = useRegister({
    onSuccess: () => {
      onSuccess?.()
    },
    onError: (error) => {
      onError?.(error)
    },
  })

  const handleSubmit = (values: RegisterCredentials) => {
    register(values)
  }

  return (
    <Card className={`p-6 ${className || ''}`}>
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-foreground text-2xl font-bold">Create Account</h2>
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
                  autoComplete="new-password"
                  className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                  placeholder="Create a password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-destructive mt-1 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="text-foreground mb-1 block text-sm font-medium"
                >
                  Confirm Password *
                </label>
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                  placeholder="Confirm your password"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-destructive mt-1 text-sm"
                />
              </div>

              <Button type="submit" disabled={!isValid || !dirty || isLoading} className="w-full">
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Card>
  )
}
