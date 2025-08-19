'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { queryKeys } from '@/lib/query-client'
import type {
  Project,
  ProjectFilters,
  ProjectSortOptions,
  CreateProjectFormData,
  UpdateProjectData,
  DatabaseProjectInsert,
} from '../types'

export interface UseProjectsOptions {
  filters?: ProjectFilters
  sortOptions?: ProjectSortOptions
  pagination?: {
    page: number
    limit: number
  }
  enabled?: boolean
}

export interface UseProjectsQueryReturn {
  projects: Project[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
  hasNextPage: boolean
  fetchNextPage: () => void
  isFetchingNextPage: boolean
  createProject: {
    mutate: (data: CreateProjectFormData) => void
    isPending: boolean
    error: Error | null
  }
  updateProject: {
    mutate: (params: { id: string; data: Partial<UpdateProjectData> }) => void
    isPending: boolean
    error: Error | null
  }
  deleteProject: {
    mutate: (id: string) => void
    isPending: boolean
    error: Error | null
  }
}

// Fetch projects query function
const fetchProjects = async (
  userId: string,
  options: UseProjectsOptions = {}
): Promise<{ projects: Project[]; total: number }> => {
  const {
    filters = {},
    sortOptions = { field: 'created_at', direction: 'desc' },
    pagination = { page: 1, limit: 12 },
  } = options

  let query = supabase.from('projects').select('*', { count: 'exact' })

  // Apply filters
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }
  if (filters.status) {
    query = query.eq('status', filters.status)
  }
  if (filters.priority) {
    query = query.eq('priority', filters.priority)
  }

  // Apply sorting
  query = query.order(sortOptions.field, { ascending: sortOptions.direction === 'asc' })

  // Apply pagination
  const from = (pagination.page - 1) * pagination.limit
  const to = from + pagination.limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    throw new Error(error.message)
  }

  const projects: Project[] = (data || []).map((project) => ({
    id: project.id,
    name: project.name,
    description: project.description,
    priority: project.priority,
    status: project.status,
    start_date: project.start_date,
    end_date: project.end_date,
    created_by: project.created_by,
    created_at: project.created_at,
    updated_at: project.updated_at,
  }))

  return {
    projects,
    total: count || 0,
  }
}

export function useProjects(
  options: UseProjectsOptions = {},
  userId?: string
): UseProjectsQueryReturn {
  const queryClient = useQueryClient()
  const { enabled = true } = options

  // Query for fetching projects
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.projects.list(options),
    queryFn: () => fetchProjects(userId || '', options),
    enabled: enabled && !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })

  const projects = data?.projects || []

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (projectData: CreateProjectFormData) => {
      if (!userId) {
        throw new Error('User must be authenticated to create projects')
      }

      const insertData: DatabaseProjectInsert = {
        name: projectData.name,
        description: projectData.description || null,
        priority: projectData.priority,
        status: projectData.status,
        start_date: projectData.start_date || null,
        end_date: projectData.end_date || null,
        created_by: userId,
      }

      const { data: project, error } = await supabase
        .from('projects')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      // Add the creator as the project owner
      const memberInserts = [
        {
          project_id: project.id,
          user_id: userId,
          role: 'owner',
        },
      ]

      // Add assigned users as members
      if (projectData.assigned_users && projectData.assigned_users.length > 0) {
        const assignedMemberInserts = projectData.assigned_users
          .filter((assignedUserId) => assignedUserId !== userId) // Don't duplicate the owner
          .map((assignedUserId) => ({
            project_id: project.id,
            user_id: assignedUserId,
            role: 'member',
          }))

        memberInserts.push(...assignedMemberInserts)
      }

      const { error: memberError } = await supabase.from('project_members').insert(memberInserts)

      if (memberError) {
        // If adding members fails, we should clean up the project
        await supabase.from('projects').delete().eq('id', project.id)
        throw new Error('Failed to set project membership')
      }

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        priority: project.priority,
        status: project.status,
        start_date: project.start_date,
        end_date: project.end_date,
        created_by: project.created_by,
        created_at: project.created_at,
        updated_at: project.updated_at,
      } as Project
    },
    onSuccess: (newProject) => {
      // Invalidate and refetch projects lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.lists(),
      })
      // Invalidate all projects queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.all,
      })
      // Invalidate project members for the new project
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.members.byProject(newProject.id),
      })
    },
  })

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async ({
      id,
      data: updateData,
    }: {
      id: string
      data: Partial<UpdateProjectData>
    }) => {
      if (!userId) {
        throw new Error('User must be authenticated to update projects')
      }

      const { data: project, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        priority: project.priority,
        status: project.status,
        start_date: project.start_date,
        end_date: project.end_date,
        created_by: project.created_by,
        created_at: project.created_at,
        updated_at: project.updated_at,
      } as Project
    },
    onSuccess: (updatedProject) => {
      // Invalidate and refetch projects lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.lists(),
      })
      // Invalidate all projects queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.all,
      })
      // Invalidate specific project query
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.byId(updatedProject.id),
      })
      // Invalidate project members for the updated project
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.members.byProject(updatedProject.id),
      })
    },
  })

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) {
        throw new Error('User must be authenticated to delete projects')
      }

      const { error } = await supabase.from('projects').delete().eq('id', id)

      if (error) {
        throw new Error(error.message)
      }

      return id
    },
    onSuccess: (deletedProjectId) => {
      // Invalidate and refetch projects lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.lists(),
      })
      // Invalidate all projects queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.all,
      })
      // Remove specific project from cache
      queryClient.removeQueries({
        queryKey: queryKeys.projects.byId(deletedProjectId),
      })
      // Remove project members from cache
      queryClient.removeQueries({
        queryKey: queryKeys.projects.members.byProject(deletedProjectId),
      })
    },
  })

  return {
    projects,
    isLoading,
    error,
    refetch,
    hasNextPage: false, // TODO: Implement infinite query if needed
    fetchNextPage: () => {}, // TODO: Implement infinite query if needed
    isFetchingNextPage: false,
    createProject: {
      mutate: createProjectMutation.mutate,
      isPending: createProjectMutation.isPending,
      error: createProjectMutation.error,
    },
    updateProject: {
      mutate: updateProjectMutation.mutate,
      isPending: updateProjectMutation.isPending,
      error: updateProjectMutation.error,
    },
    deleteProject: {
      mutate: deleteProjectMutation.mutate,
      isPending: deleteProjectMutation.isPending,
      error: deleteProjectMutation.error,
    },
  }
}
