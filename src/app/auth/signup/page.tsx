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
import { validateEmail, validatePassword, validateUsername, debounce } from '@/lib/validation'
import { Rocket, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

interface SignUpFormData {
  username: string
  email: string
  password: string
}

interface ValidationErrors {
  username?: string | undefined
  email?: string | undefined
  password?: string | undefined
}

export default function SignUpPage() {
  const router = useRouter()
  const { user, loading, signUp, signInWithOAuth, oauthLoading } = useAuth()
  const [formData, setFormData] = useState<SignUpFormData>({
    username: '',
    email: '',
    password: '',
  })
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // Debounced validation functions
  const debouncedValidateEmail = useCallback(
    debounce((email: string) => {
      const result = validateEmail(email)
      setValidationErrors((prev) => ({
        ...prev,
        email: result.isValid ? undefined : result.error,
      }))
    }, 300),
    []
  )

  const debouncedValidateUsername = useCallback(
    debounce((username: string) => {
      const result = validateUsername(username)
      setValidationErrors((prev) => ({
        ...prev,
        username: result.isValid ? undefined : result.error,
      }))
    }, 300),
    []
  )

  const debouncedValidatePassword = useCallback(
    debounce((password: string) => {
      const result = validatePassword(password)
      setValidationErrors((prev) => ({
        ...prev,
        password: result.isValid ? undefined : result.error,
      }))
    }, 300),
    []
  )

  // Check if user is already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear general errors when user starts typing
    if (error) {
      setError(null)
    }
    if (success) {
      setSuccess(null)
    }

    // Real-time validation
    if (name === 'email') {
      debouncedValidateEmail(value)
    } else if (name === 'username') {
      debouncedValidateUsername(value)
    } else if (name === 'password') {
      debouncedValidatePassword(value)
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
    setSuccess(null)

    // Validate form before submission
    const usernameValidation = validateUsername(formData.username)
    const emailValidation = validateEmail(formData.email)
    const passwordValidation = validatePassword(formData.password)

    const errors: ValidationErrors = {}

    if (!usernameValidation.isValid) {
      errors.username = usernameValidation.error
    }

    if (!emailValidation.isValid) {
      errors.email = emailValidation.error
    }

    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.error
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      setIsLoading(false)
      return
    }

    try {
      const result = await signUp(formData.email, formData.password, formData.username)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess('Account created successfully! Please check your email to verify your account.')

        // Redirect to sign in page after a short delay
        setTimeout(() => {
          router.push('/auth/signin')
        }, 2000)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Sign up error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
    setError(null)

    try {
      const result = await signInWithOAuth(provider)

      if (result.error) {
        setError(result.error)
      }
      // Note: On success, the user will be redirected to the callback page
      // OAuth loading state is managed by the AuthProvider
    } catch (err) {
      setError(`Failed to sign up with ${provider}. Please try again.`)
      console.error(`${provider} OAuth error:`, err)
    }
  }

  const isFormValid =
    formData.username.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.password.trim() !== ''

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mb-2 flex justify-center">
            <Rocket className="text-primary h-12 w-12" />
          </div>
          <h1 className="text-foreground text-3xl font-bold">Create account</h1>
          <p className="text-muted-foreground mt-2">Join Pegasus and start managing your tasks</p>
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
            <form onSubmit={handleSubmit} className="space-y-4" data-form-type="other">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Success Alert */}
              {success && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username">
                  Username <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  autoComplete="new-username"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-form-type="other"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  className={
                    validationErrors.username ? 'border-destructive focus:border-destructive' : ''
                  }
                />
                {validationErrors.username ? (
                  <p className="text-destructive mt-1 text-sm">{validationErrors.username}</p>
                ) : (
                  <p className="text-muted-foreground text-xs">
                    Username must be at least 3 characters (letters, numbers, and underscores only)
                  </p>
                )}
              </div>

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
                    placeholder="Create a password"
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
                {validationErrors.password ? (
                  <p className="text-destructive mt-1 text-sm">{validationErrors.password}</p>
                ) : (
                  <p className="text-muted-foreground text-xs">
                    Password must be at least 8 characters long
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
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
                googleLoading={oauthLoading.google}
                githubLoading={oauthLoading.github}
              />
            </div>
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
