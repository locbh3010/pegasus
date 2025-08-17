import { supabase } from '@/lib/supabase'
import type { LoginCredentials, RegisterCredentials, AuthUser, AuthError } from '../types'

// Transform Supabase user to our AuthUser type
const transformUser = (user: unknown): AuthUser => {
  const userObj = user as Record<string, unknown>
  return {
    id: userObj.id as string,
    email: userObj.email as string,
    full_name: (userObj.full_name as string) || (userObj.email as string),
    avatar_url: userObj.avatar_url as string | null,
    role: (userObj.role as string) || 'user',
    status: (userObj.status as string) || 'active',
    department: userObj.department as string | null,
    position: userObj.position as string | null,
    phone: userObj.phone as string | null,
    created_at: userObj.created_at as string | null,
    updated_at: userObj.updated_at as string | null,
  }
}

// Auth API service functions
export const authApi = {
  // Login with email and password
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) {
        throw new Error(error.message)
      }

      if (!data.user) {
        throw new Error('Login failed: No user data returned')
      }

      return transformUser(data.user)
    } catch (error) {
      const authError: AuthError = {
        message: error instanceof Error ? error.message : 'Login failed',
        status: 401,
      }
      throw authError
    }
  },

  // Register new user
  async register(credentials: RegisterCredentials): Promise<AuthUser> {
    try {
      // Validate password confirmation
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match')
      }

      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) {
        throw new Error(error.message)
      }

      if (!data.user) {
        throw new Error('Registration failed: No user data returned')
      }

      return transformUser(data.user)
    } catch (error) {
      const authError: AuthError = {
        message: error instanceof Error ? error.message : 'Registration failed',
        status: 400,
      }
      throw authError
    }
  },

  // Logout current user
  async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      const authError: AuthError = {
        message: error instanceof Error ? error.message : 'Logout failed',
        status: 500,
      }
      throw authError
    }
  },

  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error) {
        throw new Error(error.message)
      }

      return user ? transformUser(user) : null
    } catch (error) {
      console.error('Failed to get current user:', error)
      return null
    }
  },

  // Get current session
  async getCurrentSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        throw new Error(error.message)
      }

      return session
    } catch (error) {
      console.error('Failed to get current session:', error)
      return null
    }
  },

  // Refresh session
  async refreshSession() {
    try {
      const { data, error } = await supabase.auth.refreshSession()

      if (error) {
        throw new Error(error.message)
      }

      return data.session
    } catch (error) {
      console.error('Failed to refresh session:', error)
      return null
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange((_event: unknown, session: unknown) => {
      const sessionObj = session as Record<string, unknown> | null
      const user = sessionObj?.user ? transformUser(sessionObj.user) : null
      callback(user)
    })
  },
}
