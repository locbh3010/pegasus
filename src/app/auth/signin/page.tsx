'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/features/auth/components/auth-provider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardHeading,
  CardToolbar,
  CardFooter,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { OAuthButtons } from '@/features/auth/components/oauth-buttons'
import { Rocket, Eye, EyeOff, AlertCircle } from 'lucide-react'

interface SignInFormData {
  email: string
  password: string
}

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
  email: Yup.string().email('Please enter a valid email address').required('Email is required'),
  password: Yup.string().min(1, 'Password is required').required('Password is required'),
})

export default function SignInPage() {
  const router = useRouter()
  const { user, loading, signIn, signInWithOAuth } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // Check if user is already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const handleSubmit = async (
    values: SignInFormData,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setError(null)

    try {
      await signIn(values.email, values.password)
      router.push('/dashboard')
    } catch (_err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
    setError(null)

    try {
      await signInWithOAuth(provider)
      // Note: On success, the user will be redirected to the callback page
    } catch (_err) {
      setError(`Failed to sign in with ${provider}. Please try again.`)
    }
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <Rocket className="text-primary h-6 w-6" />
          </div>
          <h1 className="text-foreground text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>

        {/* Sign In Form */}
        <Card className="w-full max-w-[500px]" variant="accent">
          <CardHeader className="px-6 py-6">
            <CardHeading>
              <CardTitle className="text-xl">Sign In</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeading>
            <CardToolbar>{/* Optional toolbar items */}</CardToolbar>
          </CardHeader>
          <CardContent className="pt-6 pb-6">
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-4" data-form-type="other">
                  {/* Error Alert */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

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
                          onChange={(e) => {
                            field.onChange(e)
                            if (error) {
                              setError(null)
                            }
                          }}
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
                            autoComplete="current-password"
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
                            onChange={(e) => {
                              field.onChange(e)
                              if (error) {
                                setError(null)
                              }
                            }}
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
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
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
                    onGoogleClick={() => handleOAuthSignIn('google')}
                    onGitHubClick={() => handleOAuthSignIn('github')}
                    disabled={isSubmitting}
                  />
                </Form>
              )}
            </Formik>
          </CardContent>
          <CardFooter className="justify-center">
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don&apos;t have an account? </span>
              <Link href="/auth/signup" className="text-primary font-medium hover:underline">
                Sign up
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
