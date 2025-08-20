import { User as SupabaseUser } from '@supabase/supabase-js'

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
