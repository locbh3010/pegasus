// Project-related type definitions (UI-only)
import type { Tables, TablesInsert, TablesUpdate } from '@/types/supabase'
import { ProjectPriority } from './constants/project-priority'
import { ProjectStatus } from './constants/project-status'

// Core Project interface using Supabase types with enum overrides
export interface Project extends Omit<Tables<'projects'>, 'priority' | 'status'> {
  priority: ProjectPriority
  status: ProjectStatus
}

// Database operation types using Supabase types with enum overrides
export type CreateProjectData = Omit<TablesInsert<'projects'>, 'priority' | 'status'> & {
  priority: ProjectPriority
  status: ProjectStatus
}

export type UpdateProjectData = Omit<TablesUpdate<'projects'>, 'priority' | 'status'> & {
  priority?: ProjectPriority
  status?: ProjectStatus
}

// Component Props types
export interface ProjectCardProps {
  project: Project
  viewMode?: 'grid' | 'list'
  onDelete?: (projectId: string) => void
  onView?: (projectId: string) => void
  className?: string
}

export interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  className?: string
}

export interface ProjectsPageProps {
  initialProjects?: Project[]
  className?: string
}

export interface ProjectsQueryParams {
  page?: number
  limit?: number
}
