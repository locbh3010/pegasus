'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { UserService } from '@/features/auth/services/user-service'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, username?: string) => Promise<{ error?: string }>
  signInWithOAuth: (provider: 'facebook' | 'github' | 'google') => Promise<{ error?: string }>
  signOut: () => Promise<void>
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
  const supabase = createClient()

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

      // Handle OAuth user creation in database
      if (event === 'SIGNED_IN' && session?.user) {
        await handleOAuthUserCreation(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

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

  const signInWithOAuth = async (provider: 'facebook' | 'github' | 'google') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect_to=${encodeURIComponent('/dashboard')}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
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
    user,
    loading,
    signIn,
    signUp,
    signInWithOAuth,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
