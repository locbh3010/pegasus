// Authentication-related type definitions
import { Tables } from '@/types/supabase'

// Database user type from Supabase
export type DatabaseUser = Tables<'users'>

// Auth user type for application use
export interface AuthUser {
  id: string
  email: string
  full_name: string
  avatar_url?: string | null
  role: string
  status: string
  department?: string | null
  position?: string | null
  phone?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  username: string
  email: string
  password: string
}

export interface AuthSession {
  accessToken: string
  refreshToken: string
  user: AuthUser
  expiresAt: number
}

export interface AuthError {
  message: string
  status?: number
}

// NextAuth specific types
export interface NextAuthUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

export interface NextAuthSession {
  user: NextAuthUser
  expires: string
}

export interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'register'
  onModeChange: (mode: 'login' | 'register') => void
}

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  username: string
  email: string
  password: string
}
