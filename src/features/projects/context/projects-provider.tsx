'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/features/auth/components/auth-provider'
import { supabase } from '@/lib/supabase/client'
import type {
  Project,
  ProjectsContextValue,
  ProjectsContextState,
  ProjectFilters,
  ProjectSortOptions,
  CreateProjectFormData,
  UpdateProjectData,
  DatabaseProjectInsert,
  PROJECT_STATUS,
  PROJECT_PRIORITY,
} from '../types'

const ProjectsContext = createContext<ProjectsContextValue | undefined>(undefined)

const DEFAULT_FILTERS: ProjectFilters = {}

const DEFAULT_SORT: ProjectSortOptions = {
  field: 'created_at',
  direction: 'desc',
}

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 12,
  total: 0,
  hasMore: false,
}

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  // State
  const [state, setState] = useState<ProjectsContextState>({
    projects: [],
    loading: false,
    error: null,
    filters: DEFAULT_FILTERS,
    sortOptions: DEFAULT_SORT,
    pagination: DEFAULT_PAGINATION,
  })

  // Helper function to update state
  const updateState = useCallback((updates: Partial<ProjectsContextState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }, [])

  // Fetch projects from Supabase
  const fetchProjects = useCallback(async () => {
    if (!user) {
      updateState({ projects: [], loading: false })
      return
    }

    updateState({ loading: true, error: null })

    try {
      let query = supabase
        .from('projects')
        .select(
          `
          *,
          project_members!inner(
            user_id,
            role
          )
        `
        )
        .eq('project_members.user_id', user.id)

      // Apply filters
      if (state.filters.status && state.filters.status.length > 0) {
        query = query.in('status', state.filters.status)
      }

      if (state.filters.priority && state.filters.priority.length > 0) {
        query = query.in('priority', state.filters.priority)
      }

      if (state.filters.search) {
        query = query.or(
          `name.ilike.%${state.filters.search}%,description.ilike.%${state.filters.search}%`
        )
      }

      // Apply sorting
      query = query.order(state.sortOptions.field, {
        ascending: state.sortOptions.direction === 'asc',
      })

      // Apply pagination
      const from = (state.pagination.page - 1) * state.pagination.limit
      const to = from + state.pagination.limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) {
        throw new Error(error.message)
      }

      const projects: Project[] =
        data?.map((project) => ({
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
        })) || []

      const total = count || 0
      const hasMore = state.pagination.page * state.pagination.limit < total

      updateState({
        projects,
        loading: false,
        pagination: {
          ...state.pagination,
          total,
          hasMore,
        },
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch projects'
      updateState({
        loading: false,
        error: errorMessage,
        projects: [],
      })
    }
  }, [
    user,
    state.filters,
    state.sortOptions,
    state.pagination.page,
    state.pagination.limit,
    updateState,
  ])

  // Create a new project
  const createProject = useCallback(
    async (data: CreateProjectFormData): Promise<Project> => {
      if (!user) {
        throw new Error('User must be authenticated to create projects')
      }

      updateState({ error: null })

      try {
        const projectData: DatabaseProjectInsert = {
          name: data.name,
          description: data.description || null,
          priority: data.priority,
          status: data.status,
          start_date: data.start_date || null,
          end_date: data.end_date || null,
          created_by: user.id,
        }

        const { data: project, error } = await supabase
          .from('projects')
          .insert(projectData)
          .select()
          .single()

        if (error) {
          throw new Error(error.message)
        }

        // Add the creator as the project owner
        const { error: memberError } = await supabase.from('project_members').insert({
          project_id: project.id,
          user_id: user.id,
          role: 'owner',
        })

        if (memberError) {
          // If adding member fails, we should clean up the project
          await supabase.from('projects').delete().eq('id', project.id)
          throw new Error('Failed to set project ownership')
        }

        const newProject: Project = {
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
        }

        // Add to local state
        updateState({
          projects: [newProject, ...state.projects],
          pagination: {
            ...state.pagination,
            total: state.pagination.total + 1,
          },
        })

        return newProject
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create project'
        updateState({ error: errorMessage })
        throw new Error(errorMessage)
      }
    },
    [user, state.projects, state.pagination, updateState]
  )

  // Update a project
  const updateProject = useCallback(
    async (id: string, data: Partial<UpdateProjectData>): Promise<Project> => {
      if (!user) {
        throw new Error('User must be authenticated to update projects')
      }

      updateState({ error: null })

      try {
        const { data: project, error } = await supabase
          .from('projects')
          .update(data)
          .eq('id', id)
          .select()
          .single()

        if (error) {
          throw new Error(error.message)
        }

        const updatedProject: Project = {
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
        }

        // Update local state
        updateState({
          projects: state.projects.map((p) => (p.id === id ? updatedProject : p)),
        })

        return updatedProject
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update project'
        updateState({ error: errorMessage })
        throw new Error(errorMessage)
      }
    },
    [user, state.projects, updateState]
  )

  // Delete a project
  const deleteProject = useCallback(
    async (id: string): Promise<void> => {
      if (!user) {
        throw new Error('User must be authenticated to delete projects')
      }

      updateState({ error: null })

      try {
        const { error } = await supabase.from('projects').delete().eq('id', id)

        if (error) {
          throw new Error(error.message)
        }

        // Remove from local state
        updateState({
          projects: state.projects.filter((p) => p.id !== id),
          pagination: {
            ...state.pagination,
            total: Math.max(0, state.pagination.total - 1),
          },
        })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete project'
        updateState({ error: errorMessage })
        throw new Error(errorMessage)
      }
    },
    [user, state.projects, state.pagination, updateState]
  )

  // Set filters
  const setFilters = useCallback(
    (filters: Partial<ProjectFilters>) => {
      updateState({
        filters: { ...state.filters, ...filters },
        pagination: { ...state.pagination, page: 1 }, // Reset to first page
      })
    },
    [state.filters, state.pagination, updateState]
  )

  // Set sort options
  const setSortOptions = useCallback(
    (options: ProjectSortOptions) => {
      updateState({
        sortOptions: options,
        pagination: { ...state.pagination, page: 1 }, // Reset to first page
      })
    },
    [state.pagination, updateState]
  )

  // Set page
  const setPage = useCallback(
    (page: number) => {
      updateState({
        pagination: { ...state.pagination, page },
      })
    },
    [state.pagination, updateState]
  )

  // Clear error
  const clearError = useCallback(() => {
    updateState({ error: null })
  }, [updateState])

  // Refresh projects
  const refreshProjects = useCallback(async () => {
    await fetchProjects()
  }, [fetchProjects])

  // Fetch projects when user changes or filters/sort change
  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const value: ProjectsContextValue = {
    ...state,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    setFilters,
    setSortOptions,
    setPage,
    clearError,
    refreshProjects,
  }

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>
}

export function useProjects(): ProjectsContextValue {
  const context = useContext(ProjectsContext)
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider')
  }
  return context
}
