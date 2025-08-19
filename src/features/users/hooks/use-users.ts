'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import { queryKeys } from '@/lib/query-client'
import type { UserOption } from '@/components/form/types'

export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string | null
  department?: string | null
  position?: string | null
  role: string
  status: string
}

export interface UseUsersOptions {
  enabled?: boolean
  searchQuery?: string
}

export interface UseUsersReturn {
  users: User[]
  userOptions: UserOption[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

// Fetch active users query function
const fetchActiveUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, full_name, avatar_url, department, position, role, status')
    .eq('status', 'active')
    .order('full_name')

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

// Search users query function
const searchUsers = async (query: string): Promise<User[]> => {
  if (!query.trim()) {
    return fetchActiveUsers()
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, email, full_name, avatar_url, department, position, role, status')
    .eq('status', 'active')
    .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
    .order('full_name')
    .limit(20)

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export function useUsers(options: UseUsersOptions = {}): UseUsersReturn {
  const { enabled = true, searchQuery } = options

  // Query for fetching users (with optional search)
  const {
    data: users = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: searchQuery ? queryKeys.users.search(searchQuery) : queryKeys.users.active(),
    queryFn: () => (searchQuery ? searchUsers(searchQuery) : fetchActiveUsers()),
    enabled: enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  // Convert users to UserOption format
  const userOptions: UserOption[] = useMemo(
    () =>
      users.map((user) => ({
        value: user.id,
        label: user.full_name,
        email: user.email,
        avatar: user.avatar_url || null,
        department: user.department || null,
        position: user.position || null,
      })),
    [users]
  )

  return {
    users,
    userOptions,
    isLoading,
    error,
    refetch,
  }
}
