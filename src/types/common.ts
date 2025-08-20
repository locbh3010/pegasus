import { User as SupabaseUser } from '@supabase/supabase-js'

export type QueryParams = {
    [key: string | number | symbol]: unknown
}

export type Pagination = {
    page?: number
    limit?: number
}
