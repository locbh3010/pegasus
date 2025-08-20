import { User as SupabaseUser } from '@supabase/supabase-js'

export type QueryParams = {
  [key: string | number | symbol]: unknown
}

export type Pagination = {
  page?: number
  limit?: number
}

export interface User extends SupabaseUser {
  user_metadata: {
    full_name: string
    username: string
  }
}
