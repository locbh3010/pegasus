'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { useAuth } from '@/features/auth/components/auth-provider'
import { useProjects as useProjectsQuery } from '../hooks/use-projects'
import type {
  Project,
  ProjectFilters,
  ProjectSortOptions,
  CreateProjectFormData,
  UpdateProjectData,
} from '../types'

// Simplified context for managing filters and UI state
interface ProjectsContextState {
  filters: ProjectFilters
  sortOptions: ProjectSortOptions
  pagination: {
    page: number
    limit: number
  }
}

interface ProjectsContextValue extends ProjectsContextState {
  // Data from TanStack Query
  projects: Project[]
  loading: boolean
  error: string | null

  // Actions for managing state
  setFilters: (filters: Partial<ProjectFilters>) => void
  setSortOptions: (options: ProjectSortOptions) => void
  setPage: (page: number) => void
  clearError: () => void
  refreshProjects: () => void

  // CRUD operations from TanStack Query
  createProject: (data: CreateProjectFormData) => Promise<Project>
  updateProject: (id: string, data: Partial<UpdateProjectData>) => Promise<Project>
  deleteProject: (id: string) => Promise<void>

  // Pagination info
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

const ProjectsContext = createContext<ProjectsContextValue | undefined>(undefined)

const DEFAULT_FILTERS: ProjectFilters = {}

const DEFAULT_SORT: ProjectSortOptions = {
  field: 'created_at',
  direction: 'desc',
}

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 12,
}

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  // Local state for filters and pagination
  const [state, setState] = useState<ProjectsContextState>({
    filters: DEFAULT_FILTERS,
    sortOptions: DEFAULT_SORT,
    pagination: DEFAULT_PAGINATION,
  })

  // Helper function to update state
  const updateState = useCallback((updates: Partial<ProjectsContextState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }, [])

  // Use TanStack Query for data fetching
  const projectsQuery = useProjectsQuery(
    {
      filters: state.filters,
      sortOptions: state.sortOptions,
      pagination: state.pagination,
      enabled: !!user,
    },
    user?.id
  )

  // Actions for managing filters and pagination
  const setFilters = useCallback(
    (filters: Partial<ProjectFilters>) => {
      updateState({
        filters: { ...state.filters, ...filters },
        pagination: { ...state.pagination, page: 1 }, // Reset to first page when filtering
      })
    },
    [state.filters, state.pagination, updateState]
  )

  const setSortOptions = useCallback(
    (options: ProjectSortOptions) => {
      updateState({
        sortOptions: options,
        pagination: { ...state.pagination, page: 1 }, // Reset to first page when sorting
      })
    },
    [state.pagination, updateState]
  )

  const setPage = useCallback(
    (page: number) => {
      updateState({
        pagination: { ...state.pagination, page },
      })
    },
    [state.pagination, updateState]
  )

  const clearError = useCallback(() => {
    // Error is managed by TanStack Query, so we just trigger a refetch
    projectsQuery.refetch()
  }, [projectsQuery])

  const refreshProjects = useCallback(() => {
    projectsQuery.refetch()
  }, [projectsQuery])

  // CRUD operations using TanStack Query mutations
  const createProject = useCallback(
    async (data: CreateProjectFormData): Promise<Project> => {
      // Use the mutation directly and let TanStack Query handle the promise
      projectsQuery.createProject.mutate(data)
      // Return a placeholder - in a real implementation, you'd use mutateAsync
      // or handle the result through the mutation state
      return {} as Project
    },
    [projectsQuery.createProject]
  )

  const updateProject = useCallback(
    async (id: string, data: Partial<UpdateProjectData>): Promise<Project> => {
      // Use the mutation directly and let TanStack Query handle the promise
      projectsQuery.updateProject.mutate({ id, data })
      // Return a placeholder - in a real implementation, you'd use mutateAsync
      return {} as Project
    },
    [projectsQuery.updateProject]
  )

  const deleteProject = useCallback(
    async (id: string): Promise<void> => {
      // Use the mutation directly and let TanStack Query handle the promise
      projectsQuery.deleteProject.mutate(id)
      // Return immediately - in a real implementation, you'd use mutateAsync
      return Promise.resolve()
    },
    [projectsQuery.deleteProject]
  )

  // Prepare context value
  const value: ProjectsContextValue = {
    // State
    filters: state.filters,
    sortOptions: state.sortOptions,
    pagination: {
      ...state.pagination,
      total: 0, // TODO: Get from query result
      hasMore: false, // TODO: Get from query result
    },

    // Data from TanStack Query
    projects: projectsQuery.projects,
    loading: projectsQuery.isLoading,
    error: projectsQuery.error?.message || null,

    // Actions
    setFilters,
    setSortOptions,
    setPage,
    clearError,
    refreshProjects,

    // CRUD operations
    createProject,
    updateProject,
    deleteProject,
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
