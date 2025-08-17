// Note: This file contains Supabase utilities but we're now using NextAuth
// These functions are kept for potential future database operations
import type { Database, TablesInsert, TablesUpdate } from '@/types/supabase'

type TaskInsert = TablesInsert<'tasks'>
type TaskUpdate = TablesUpdate<'tasks'>

// Mock supabase client for now since we're using NextAuth
const supabase = {
  from: () => ({
    select: () => ({ eq: () => ({ order: () => ({ data: [], error: null }) }) }),
    insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
    update: () => ({ eq: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }) }),
    delete: () => ({ eq: () => ({ error: null }) }),
  }),
  auth: {
    getUser: () => ({ data: { user: null }, error: null }),
    signInWithPassword: () => ({ data: null, error: null }),
    signUp: () => ({ data: null, error: null }),
    signOut: () => ({ error: null }),
  },
  channel: () => ({
    on: () => ({ subscribe: () => ({}) }),
  }),
}

// Task operations
export const taskOperations = {
  // Get all tasks for a user
  async getTasks(userId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`)
    }

    return data
  },

  // Create a new task
  async createTask(task: TaskInsert) {
    const { data, error } = await supabase.from('tasks').insert(task).select().single()

    if (error) {
      throw new Error(`Failed to create task: ${error.message}`)
    }

    return data
  },

  // Update a task
  async updateTask(id: string, updates: TaskUpdate) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update task: ${error.message}`)
    }

    return data
  },

  // Delete a task
  async deleteTask(id: string) {
    const { error } = await supabase.from('tasks').delete().eq('id', id)

    if (error) {
      throw new Error(`Failed to delete task: ${error.message}`)
    }
  },

  // Toggle task completion
  async toggleTask(id: string, completed: boolean) {
    return this.updateTask(id, { completed })
  },
}

// Real-time subscriptions
export const subscriptions = {
  // Subscribe to task changes
  subscribeToTasks(userId: string, callback: (payload: unknown) => void) {
    return supabase
      .channel('tasks')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe()
  },
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
