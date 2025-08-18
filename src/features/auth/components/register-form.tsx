'use client'

import { Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardHeading,
} from '@/components/ui/card'
import { FormikField } from '@/components/ui/formik-field'
import { useRegister } from '../hooks/use-register'
import type { RegisterCredentials } from '../types'

const registerValidationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .required('Username is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
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
    <Card className={`w-full max-w-[500px] ${className || ''}`} variant="accent">
      <CardHeader className="px-6 py-6">
        <CardHeading>
          <CardTitle className="text-xl">Create Account</CardTitle>
          <CardDescription>Sign up to get started with your account</CardDescription>
        </CardHeading>
      </CardHeader>
      <CardContent className="pt-6 pb-6">
        <div className="space-y-4">
          <Formik
            initialValues={{
              username: '',
              email: '',
              password: '',
            }}
            validationSchema={registerValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ isValid, dirty }) => (
              <Form className="space-y-4" data-form-type="other">
                <div>
                  <label
                    htmlFor="username"
                    className="text-foreground mb-1 block text-sm font-medium"
                  >
                    Username <span className="text-destructive">*</span>
                  </label>
                  <FormikField
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-destructive mt-1 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="text-foreground mb-1 block text-sm font-medium">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <FormikField id="email" name="email" type="text" placeholder="Enter your email" />
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
                    Password <span className="text-destructive">*</span>
                  </label>
                  <FormikField
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                  />
                  <ErrorMessage
                    name="password"
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
      </CardContent>
    </Card>
  )
}
