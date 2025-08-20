import { User as SupabaseUser } from '@supabase/supabase-js'
export * from './supabase'

// Application types that map to database types
export interface User extends SupabaseUser {
    full_name: string
    role?: string
    status?: string
    id: string
}
