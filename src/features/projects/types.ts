// Project-related type definitions (UI-only)
import { Pagination, QueryParams } from '@/types/common'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/supabase'
import { ProjectPriority } from './constants/project-priority'
import { ProjectStatus } from './constants/project-status'
import { Member } from '../members/member.types'

// Core Project interface using Supabase types with enum overrides
export interface Project extends Omit<Tables<'projects'>, 'priority' | 'status'> {
  priority: ProjectPriority
  status: ProjectStatus
  members: Member[]
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
  onDelete?: (projectId: Project['id']) => void
  onView?: (projectId: Project['id']) => void
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

export interface ProjectsQueryParams extends QueryParams, Pagination {
  search?: string
  status?: ProjectStatus[]
  priority?: ProjectPriority[]
}
