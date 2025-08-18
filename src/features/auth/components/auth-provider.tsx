'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { UserService } from '@/features/auth/services/user-service'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  // User state
  user: User | null
  loading: boolean
  isAuthenticated: boolean

  // Session management
  lastLoginTime: number | null
  sessionExpiry: number | null
  isSessionValid: () => boolean

  // OAuth loading states
  oauthLoading: {
    github: boolean
    google: boolean
  }

  // Authentication methods
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, username?: string) => Promise<{ error?: string }>
  signInWithOAuth: (provider: 'github' | 'google') => Promise<{ error?: string }>
  signOut: () => Promise<void>

  // State management methods
  setOAuthLoading: (provider: 'github' | 'google', loading: boolean) => void
  updateUser: (updates: Partial<User>) => void
  clearAuthData: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastLoginTime, setLastLoginTime] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('auth-lastLoginTime')
      return stored ? parseInt(stored, 10) : null
    }
    return null
  })
  const [sessionExpiry, setSessionExpiry] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('auth-sessionExpiry')
      return stored ? parseInt(stored, 10) : null
    }
    return null
  })
  const [oauthLoading, setOauthLoadingState] = useState({
    github: false,
    google: false,
  })
  const supabase = createClient()

  // Computed values
  const isAuthenticated = !!user

  // Session validation
  const isSessionValid = () => {
    return sessionExpiry ? Date.now() < sessionExpiry : false
  }

  // Helper methods
  const setOAuthLoading = (provider: 'github' | 'google', loading: boolean) => {
    setOauthLoadingState((prev) => ({ ...prev, [provider]: loading }))
  }

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null))
  }

  const clearAuthData = () => {
    setUser(null)
    setLastLoginTime(null)
    setSessionExpiry(null)
    setOauthLoadingState({
      github: false,
      google: false,
    })

    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-lastLoginTime')
      localStorage.removeItem('auth-sessionExpiry')
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)

      // Handle sign in events
      if (event === 'SIGNED_IN' && session?.user) {
        const loginTime = Date.now()
        const expiry = loginTime + 24 * 60 * 60 * 1000 // 24 hours

        setLastLoginTime(loginTime)
        setSessionExpiry(expiry)

        // Persist to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-lastLoginTime', loginTime.toString())
          localStorage.setItem('auth-sessionExpiry', expiry.toString())
        }

        await handleOAuthUserCreation(session.user)
      }

      // Handle sign out events
      if (event === 'SIGNED_OUT') {
        clearAuthData()
      }

      // Handle token refresh events
      if (event === 'TOKEN_REFRESHED' && session?.user) {
        console.log('Token refreshed successfully')
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  // Add session monitoring with automatic validation
  useEffect(() => {
    let sessionCheckInterval: NodeJS.Timeout

    const validateSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error('Session validation error:', error)
          // If there's an error getting the session, clear auth data
          clearAuthData()
          return
        }

        // If no session exists but we think we have a user, clear auth data
        if (!session && user) {
          console.log('No valid session found, clearing auth data')
          clearAuthData()
          return
        }

        // If session exists but user state is null, update user state
        if (session?.user && !user) {
          console.log('Session found but user state is null, updating user state')
          setUser(session.user)
        }

        // Check if session is expired
        if (session?.expires_at) {
          const expiryTime = new Date(session.expires_at).getTime()
          const currentTime = Date.now()

          if (currentTime >= expiryTime) {
            console.log('Session expired, attempting refresh')
            const { error: refreshError } = await supabase.auth.refreshSession()

            if (refreshError) {
              console.error('Failed to refresh session:', refreshError)
              clearAuthData()
            }
          }
        }
      } catch (error) {
        console.error('Session validation failed:', error)
        clearAuthData()
      }
    }

    // Only start session monitoring if we have a user
    if (user) {
      // Validate session immediately
      validateSession()

      // Set up interval to check session every 30 seconds
      sessionCheckInterval = setInterval(validateSession, 30000)
    }

    return () => {
      if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval)
      }
    }
  }, [user, supabase.auth])

  // Helper function to handle OAuth user creation in database
  const handleOAuthUserCreation = async (user: User) => {
    try {
      // Check if user already exists in database
      const existingUser = await UserService.getUserById(user.id)

      if (!existingUser) {
        // Extract user data from OAuth provider
        const email = user.email || ''
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name || ''
        const username = UserService.generateUsernameFromOAuth(user)

        // Create user record in database
        await UserService.createUser({
          id: user.id,
          email,
          username,
          full_name: fullName,
        })

        console.error('OAuth user record created successfully in database')
      }
    } catch (error) {
      console.error('Failed to create OAuth user record in database:', error)
      // Don't throw error here as it would disrupt the OAuth flow
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }

    return {}
  }

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      // Step 1: Create auth user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || '',
          },
        },
      })

      if (authError) {
        return { error: authError.message }
      }

      if (!authData.user) {
        return { error: 'Registration failed: No user data returned' }
      }

      // Step 2: Create user record in database using service client
      try {
        if (!authData.user.email) {
          return { error: 'Registration failed: No email provided' }
        }

        await UserService.createUser({
          id: authData.user.id,
          email: authData.user.email,
          username: username || '',
          full_name: username || '',
        })

        console.error('User record created successfully in database')
      } catch (dbError) {
        console.error('Failed to create user record in database:', dbError)
        // Note: Auth user is already created, but database record failed
        // In a production app, you might want to implement cleanup or retry logic
        return {
          error: `Account created but profile setup failed. Please contact support. Error: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`,
        }
      }

      return {}
    } catch (error) {
      console.error('SignUp error:', error)
      return {
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred during registration',
      }
    }
  }

  const signInWithOAuth = async (provider: 'github' | 'google') => {
    try {
      setOAuthLoading(provider, true)

      const redirectUrl = `${window.location.origin}/auth/callback?redirect_to=${encodeURIComponent('/dashboard')}`
      console.log(`Initiating ${provider} OAuth with redirect URL:`, redirectUrl)

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        console.error(`${provider} OAuth error:`, error)
        setOAuthLoading(provider, false)
        return { error: error.message }
      }

      console.log(`${provider} OAuth initiated successfully, redirecting...`)
      // Note: OAuth loading will be cleared by the auth state change listener
      return {}
    } catch (error) {
      setOAuthLoading(provider, false)
      console.error('OAuth sign-in error:', error)
      return {
        error: error instanceof Error ? error.message : 'OAuth authentication failed',
      }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    // User state
    user,
    loading,
    isAuthenticated,

    // Session management
    lastLoginTime,
    sessionExpiry,
    isSessionValid,

    // OAuth loading states
    oauthLoading,

    // Authentication methods
    signIn,
    signUp,
    signInWithOAuth,
    signOut,

    // State management methods
    setOAuthLoading,
    updateUser,
    clearAuthData,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
