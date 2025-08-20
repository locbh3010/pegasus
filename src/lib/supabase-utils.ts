// Note: This file contains Supabase utilities but we're now using NextAuth
// These functions are kept for potential future database operations
import type { TablesInsert, TablesUpdate } from '@/types/supabase'

// Mock supabase client for now since we're using NextAuth
const createMockQueryBuilder = () => ({
  select: (_columns?: string) => createMockQueryBuilder(),
  eq: (_column: string, _value: unknown) => createMockQueryBuilder(),
  order: (_column: string, _options?: { ascending?: boolean }) => createMockQueryBuilder(),
  insert: (_data: unknown) => createMockQueryBuilder(),
  update: (_data: unknown) => createMockQueryBuilder(),
  delete: () => createMockQueryBuilder(),
  single: () => createMockQueryBuilder(),
  data: [],
  error: null as { message: string } | null,
})

const supabase = {
  from: (_table: string) => createMockQueryBuilder(),
  auth: {
    getUser: () =>
      Promise.resolve({ data: { user: null }, error: null as { message: string } | null }),
    signInWithPassword: (_credentials: unknown) =>
      Promise.resolve({ data: null, error: null as { message: string } | null }),
    signUp: (_credentials: unknown) =>
      Promise.resolve({ data: null, error: null as { message: string } | null }),
    signOut: () => Promise.resolve({ error: null as { message: string } | null }),
  },
  channel: (_name: string) => ({
    on: (_event: string, _config: unknown, _callback: unknown) => ({ subscribe: () => ({}) }),
  }),
}

// Real-time subscriptions
export const subscriptions = {
  // Add subscription functions here when needed
}

// Auth helpers
export const authHelpers = {
  // Get current user
  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      throw new Error(`Failed to get user: ${error.message}`)
    }

    return user
  },

  // Sign in with email
  async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(`Failed to sign in: ${error.message}`)
    }

    return data
  },

  // Sign up with email
  async signUpWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      throw new Error(`Failed to sign up: ${error.message}`)
    }

    return data
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw new Error(`Failed to sign out: ${error.message}`)
    }
  },
}
