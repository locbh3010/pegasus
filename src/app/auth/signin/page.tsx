'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/features/auth/components/auth-provider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
import { validateEmail } from '@/lib/validation'
import { Rocket, Eye, EyeOff, AlertCircle } from 'lucide-react'

interface SignInFormData {
  email: string
  password: string
}

interface ValidationErrors {
  email?: string | undefined
  password?: string | undefined
}

export default function SignInPage() {
  const router = useRouter()
  const { user, loading, signIn, signInWithOAuth } = useAuth()
  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
  })
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // Check if user is already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  // Debounced validation function
  const debouncedValidateEmail = useCallback((email: string) => {
    const timeoutId = setTimeout(() => {
      const result = validateEmail(email)
      setValidationErrors((prev) => ({
        ...prev,
        email: result.isValid ? undefined : result.error,
      }))
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear general error when user starts typing
    if (error) {
      setError(null)
    }

    // Real-time validation for email
    if (name === 'email') {
      debouncedValidateEmail(value)
    }

    // Clear field-specific validation error when user starts typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate form before submission
    const emailValidation = validateEmail(formData.email)
    const errors: ValidationErrors = {}

    if (!emailValidation.isValid) {
      errors.email = emailValidation.error
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required'
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      setIsLoading(false)
      return
    }

    try {
      await signIn(formData.email, formData.password)
      router.push('/dashboard')
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Sign in error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
    setError(null)

    try {
      await signInWithOAuth(provider)
      // Note: On success, the user will be redirected to the callback page
      // OAuth loading state is managed by the AuthProvider
    } catch (err) {
      setError(`Failed to sign in with ${provider}. Please try again.`)
      console.error(`${provider} OAuth error:`, err)
    }
  }

  const isFormValid = formData.email.trim() !== '' && formData.password.trim() !== ''

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mb-2 flex justify-center">
            <Rocket className="text-primary h-12 w-12" />
          </div>
          <h1 className="text-foreground text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your Pegasus account</p>
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
            <form onSubmit={handleSubmit} className="space-y-4" data-form-type="other">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  autoComplete="new-email"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-form-type="other"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  className={
                    validationErrors.email ? 'border-destructive focus:border-destructive' : ''
                  }
                />
                {validationErrors.email && (
                  <p className="text-destructive mt-1 text-sm">{validationErrors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    data-form-type="other"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    className={
                      validationErrors.password ? 'border-destructive focus:border-destructive' : ''
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {validationErrors.password && (
                  <p className="text-destructive mt-1 text-sm">{validationErrors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* OAuth Buttons */}
            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background text-muted-foreground px-2">
                    Or continue with social
                  </span>
                </div>
              </div>

              <OAuthButtons
                onGoogleClick={() => handleOAuthSignIn('google')}
                onGitHubClick={() => handleOAuthSignIn('github')}
                disabled={isLoading}
              />
            </div>
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
