'use client'

import { TextField } from '@/components/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTitle,
  CardToolbar,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useRegister } from '@/features/auth'
import { OAuthButtons } from '@/features/auth/components/oauth-buttons'
import { useOAuth } from '@/features/auth/hooks/use-oauth'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { AlertCircle, Eye, EyeOff, Rocket } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import * as Yup from 'yup'

interface FormikFieldProps {
  field: {
    name: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
  }
}

// Validation schema using Yup
const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .required('Username is required'),
  email: Yup.string().email('Please enter a valid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
})

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)

  const { register, isError, error, isLoading } = useRegister()
  const { mutate: oauth, error: oauthError, isPending: oauthPending } = useOAuth()

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <Rocket className="text-primary h-6 w-6" />
          </div>
          <h1 className="text-foreground text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground">Sign up to get started with your new account</p>
        </div>

        {/* Sign Up Form */}
        <Card className="w-full max-w-[500px]" variant="accent">
          <CardHeader className="px-6 py-6">
            <CardHeading>
              <CardTitle className="text-xl">Sign Up</CardTitle>
              <CardDescription>Create your account to get started</CardDescription>
            </CardHeading>
            <CardToolbar>{/* Optional toolbar items */}</CardToolbar>
          </CardHeader>
          <CardContent className="pt-6 pb-6">
            <Formik
              initialValues={{ username: '', email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={(values) => register(values)}
            >
              {({ errors, touched }) => (
                <Form className="space-y-4" data-form-type="other">
                  {/* Error Alert */}
                  {isError && error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error?.message}</AlertDescription>
                    </Alert>
                  )}

                  {/* Username Field */}
                  <TextField
                    name="username"
                    label="Username"
                    placeholder="Enter your username"
                    helperText="Username can only contain letters, numbers, and underscores"
                  />

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground text-sm font-medium">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Field name="email">
                      {({ field }: FormikFieldProps) => (
                        <Input
                          {...field}
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          autoComplete="email"
                          autoCapitalize="off"
                          spellCheck="false"
                          data-form-type="other"
                          data-lpignore="true"
                          data-1p-ignore="true"
                          className={
                            errors.email && touched.email
                              ? 'border-destructive focus:border-destructive'
                              : ''
                          }
                          onChange={(e) => field.onChange(e)}
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-destructive text-sm"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground text-sm font-medium">
                      Password <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Field name="password">
                        {({ field }: FormikFieldProps) => (
                          <Input
                            {...field}
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            autoComplete="new-password"
                            autoCapitalize="off"
                            spellCheck="false"
                            data-form-type="other"
                            data-lpignore="true"
                            data-1p-ignore="true"
                            className={
                              errors.password && touched.password
                                ? 'border-destructive focus:border-destructive pr-10'
                                : 'pr-10'
                            }
                            onChange={(e) => field.onChange(e)}
                          />
                        )}
                      </Field>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-destructive text-sm"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background text-muted-foreground px-2">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* OAuth Buttons */}
                  <OAuthButtons
                    onGoogleClick={() => oauth('google')}
                    onGitHubClick={() => oauth('github')}
                    disabled={isLoading || oauthPending}
                  />
                </Form>
              )}
            </Formik>
          </CardContent>
          <CardFooter className="justify-center">
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/auth/signin" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Footer */}
        <div className="text-muted-foreground text-center text-sm">
          <Link href="/" className="hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
