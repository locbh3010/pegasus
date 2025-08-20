// Authentication-related type definitions

import { Tables, TablesInsert, TablesUpdate } from '@/types'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  username: string
  email: string
  password: string
}

export type User = Tables<'users'>

export type UserInsert = TablesInsert<'users'>

export type UserUpdate = TablesUpdate<'users'>
