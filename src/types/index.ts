// Global type definitions for the application
export * from './supabase'
import { Tables } from './supabase'

// Database types for common use
export type DatabaseUser = Tables<'users'>
export type DatabaseTask = Tables<'tasks'>
export type DatabaseProject = Tables<'projects'>

// Application types that map to database types
export interface User {
  id: string
  full_name: string
  email: string
  avatar_url?: string | null
  role: string
  status: string
  department?: string | null
  position?: string | null
  phone?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface Task {
  id: string
  title: string
  description?: string | null
  priority: string
  status: string
  due_date?: string | null
  estimated_hours?: number | null
  actual_hours?: number | null
  assigned_to?: string | null
  created_by: string
  project_id: string
  category_id?: string | null
  parent_task_id?: string | null
  completed_at?: string | null
  created_at?: string | null
  updated_at?: string | null
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Component Props types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// Layout types
export interface LayoutProps {
  children: React.ReactNode
}
