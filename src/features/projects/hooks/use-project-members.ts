'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { queryKeys } from '@/lib/query-client'
import type { ProjectMemberWithUser } from '../types'

export interface UseProjectMembersOptions {
  enabled?: boolean
}

export interface UseProjectMembersReturn {
  members: ProjectMemberWithUser[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
  addMember: {
    mutate: (params: { userId: string; role?: string }) => void
    isPending: boolean
    error: Error | null
  }
  removeMember: {
    mutate: (userId: string) => void
    isPending: boolean
    error: Error | null
  }
  updateMemberRole: {
    mutate: (params: { userId: string; role: string }) => void
    isPending: boolean
    error: Error | null
  }
}

// Fetch project members query function
const fetchProjectMembers = async (projectId: string): Promise<ProjectMemberWithUser[]> => {
  if (!projectId) {
    throw new Error('Project ID is required')
  }

  const { data, error } = await supabase
    .from('project_members')
    .select(
      `
      id,
      project_id,
      user_id,
      role,
      joined_at,
      user:users!inner (
        id,
        full_name,
        email,
        avatar_url,
        department,
        position
      )
    `
    )
    .eq('project_id', projectId)
    .order('joined_at')

  if (error) {
    throw new Error(error.message)
  }

  // Type assertion to fix the Supabase type issue
  return (
    (data as any[])?.map((member: any) => ({
      id: member.id,
      project_id: member.project_id,
      user_id: member.user_id,
      role: member.role,
      joined_at: member.joined_at,
      user: {
        id: member.user.id,
        full_name: member.user.full_name,
        email: member.user.email,
        avatar_url: member.user.avatar_url,
        department: member.user.department,
        position: member.user.position,
      },
    })) || []
  )
}

export function useProjectMembers(
  projectId: string,
  options: UseProjectMembersOptions = {}
): UseProjectMembersReturn {
  const queryClient = useQueryClient()
  const { enabled = true } = options

  // Query for fetching project members
  const {
    data: members = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.projects.members.byProject(projectId),
    queryFn: () => fetchProjectMembers(projectId),
    enabled: enabled && !!projectId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })

  // Add member mutation
  const addMemberMutation = useMutation({
    mutationFn: async ({ userId, role = 'member' }: { userId: string; role?: string }) => {
      if (!projectId) {
        throw new Error('Project ID is required')
      }

      const { error } = await supabase.from('project_members').insert({
        project_id: projectId,
        user_id: userId,
        role,
      })

      if (error) {
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      // Invalidate and refetch project members
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.members.byProject(projectId),
      })
      // Invalidate projects lists since membership affects visibility
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.lists(),
      })
    },
  })

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!projectId) {
        throw new Error('Project ID is required')
      }

      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('project_id', projectId)
        .eq('user_id', userId)

      if (error) {
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      // Invalidate and refetch project members
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.members.byProject(projectId),
      })
      // Invalidate projects lists since membership affects visibility
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.lists(),
      })
    },
  })

  // Update member role mutation
  const updateMemberRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      if (!projectId) {
        throw new Error('Project ID is required')
      }

      const { error } = await supabase
        .from('project_members')
        .update({ role })
        .eq('project_id', projectId)
        .eq('user_id', userId)

      if (error) {
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      // Invalidate and refetch project members
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.members.byProject(projectId),
      })
      // Invalidate projects lists since role changes might affect permissions
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.lists(),
      })
    },
  })

  return {
    members,
    isLoading,
    error,
    refetch,
    addMember: {
      mutate: addMemberMutation.mutate,
      isPending: addMemberMutation.isPending,
      error: addMemberMutation.error,
    },
    removeMember: {
      mutate: removeMemberMutation.mutate,
      isPending: removeMemberMutation.isPending,
      error: removeMemberMutation.error,
    },
    updateMemberRole: {
      mutate: updateMemberRoleMutation.mutate,
      isPending: updateMemberRoleMutation.isPending,
      error: updateMemberRoleMutation.error,
    },
  }
}
