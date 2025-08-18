import { supabaseService } from '@/lib/supabase/service'
import type { Database } from '@/types/supabase'
import type { User } from '@supabase/supabase-js'

type UserInsert = Database['public']['Tables']['users']['Insert']
type UserRow = Database['public']['Tables']['users']['Row']

export interface CreateUserData {
  id: string // Auth user ID from Supabase Auth
  email: string
  username: string
  full_name?: string
}

export class UserService {
  /**
   * Generate a username from OAuth user data
   */
  static generateUsernameFromOAuth(user: User): string {
    // Try different sources for username
    const sources = [
      user.user_metadata?.user_name,
      user.user_metadata?.preferred_username,
      user.user_metadata?.login, // GitHub
      user.user_metadata?.name?.toLowerCase().replace(/\s+/g, '_'),
      user.user_metadata?.full_name?.toLowerCase().replace(/\s+/g, '_'),
      user.email?.split('@')[0],
    ]

    for (const source of sources) {
      if (source && typeof source === 'string' && source.trim()) {
        // Clean the username: only alphanumeric and underscores, max 30 chars
        const cleaned = source
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_|_$/g, '')
          .substring(0, 30)

        if (cleaned.length >= 3) {
          return cleaned
        }
      }
    }

    // Fallback: generate random username
    return `user_${Math.random().toString(36).substring(2, 8)}`
  }

  /**
   * Create a new user record in the users table
   */
  static async createUser(userData: CreateUserData): Promise<UserRow> {
    try {
      // Prepare user data for insertion
      const userInsert: UserInsert = {
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name || userData.username,
        role: 'member',
        status: 'active',
      }

      // Insert user into the users table using service client
      const { data, error } = await supabaseService
        .from('users')
        .insert(userInsert)
        .select()
        .single()

      if (error) {
        console.error('Database insertion error:', error)
        throw new Error(`Failed to create user record: ${error.message}`)
      }

      if (!data) {
        throw new Error('Failed to create user record: No data returned')
      }

      console.error('User created successfully:', data)
      return data
    } catch (error) {
      console.error('UserService.createUser error:', error)
      throw error
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<UserRow | null> {
    try {
      const { data, error } = await supabaseService
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null
        }
        throw new Error(`Failed to get user: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('UserService.getUserById error:', error)
      // Return null instead of throwing for OAuth user checks
      if (error instanceof Error && error.message.includes('Failed to get user')) {
        return null
      }
      throw error
    }
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<UserRow | null> {
    try {
      const { data, error } = await supabaseService
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null
        }
        throw new Error(`Failed to get user by email: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('UserService.getUserByEmail error:', error)
      throw error
    }
  }

  /**
   * Update user data
   */
  static async updateUser(userId: string, updates: Partial<UserInsert>): Promise<UserRow> {
    try {
      const { data, error } = await supabaseService
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update user: ${error.message}`)
      }

      if (!data) {
        throw new Error('Failed to update user: No data returned')
      }

      return data
    } catch (error) {
      console.error('UserService.updateUser error:', error)
      throw error
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(userId: string): Promise<void> {
    try {
      const { error } = await supabaseService.from('users').delete().eq('id', userId)

      if (error) {
        throw new Error(`Failed to delete user: ${error.message}`)
      }
    } catch (error) {
      console.error('UserService.deleteUser error:', error)
      throw error
    }
  }
}
