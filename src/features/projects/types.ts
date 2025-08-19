// Project-related type definitions
import { Tables, TablesInsert, TablesUpdate } from '@/types/supabase'

// Database types from Supabase
export type DatabaseProject = Tables<'projects'>
export type DatabaseProjectInsert = TablesInsert<'projects'>
export type DatabaseProjectUpdate = TablesUpdate<'projects'>
export type DatabaseProjectMember = Tables<'project_members'>
export type DatabaseTask = Tables<'tasks'>

// Application project type
export interface Project {
  id: string
  name: string
  description?: string | null
  priority: string
  status: string
  start_date?: string | null
  end_date?: string | null
  created_by: string
  created_at?: string | null
  updated_at?: string | null
}

export interface ProjectFormData {
  name: string
  description?: string
  color?: string
}

export interface ProjectMember {
  id: string
  userId: string
  projectId: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  joinedAt: Date
  user: {
    id: string
    name: string
    email: string
    avatar?: string
  }
}

export interface ProjectInvitation {
  id: string
  projectId: string
  email: string
  role: 'admin' | 'member' | 'viewer'
  invitedBy: string
  createdAt: Date
  expiresAt: Date
  status: 'pending' | 'accepted' | 'declined' | 'expired'
}

export interface ProjectWithMembers extends Project {
  members: ProjectMember[]
  memberCount: number
  userRole: 'owner' | 'admin' | 'member' | 'viewer'
}

export interface CreateProjectData {
  name: string
  description?: string
  color?: string
}

export interface UpdateProjectData {
  name?: string
  description?: string
  priority?: ProjectPriority
  status?: ProjectStatus
  start_date?: string
  end_date?: string
  color?: string
}

export interface ProjectListItem {
  id: string
  name: string
  description?: string
  color?: string
  memberCount: number
  userRole: 'owner' | 'admin' | 'member' | 'viewer'
  lastActivity: Date
}

// Project status and priority enums for type safety
export const PROJECT_STATUS = {
  PLANNING: 'planning',
  ACTIVE: 'active',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

export const PROJECT_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const

export type ProjectStatus = (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS]
export type ProjectPriority = (typeof PROJECT_PRIORITY)[keyof typeof PROJECT_PRIORITY]

// Enhanced form data types with validation
export interface CreateProjectFormData {
  name: string
  description?: string | undefined
  priority: ProjectPriority
  status: ProjectStatus
  start_date?: string | undefined
  end_date?: string | undefined
  assigned_users?: string[] | undefined
}

export interface EditProjectFormData {
  name: string
  description?: string | undefined
  priority: ProjectPriority
  status: ProjectStatus
  start_date?: string | undefined
  end_date?: string | undefined
  assigned_users?: string[] | undefined
}

export interface ProjectMemberWithUser {
  id: string
  project_id: string
  user_id: string
  role: 'owner' | 'manager' | 'member' | 'viewer'
  joined_at: string
  user: {
    id: string
    full_name: string
    email: string
    avatar_url?: string | null
    department?: string | null
    position?: string | null
  }
}

export interface ProjectFormErrors {
  name?: string
  description?: string
  priority?: string
  status?: string
  start_date?: string
  end_date?: string
  assigned_users?: string
}

// API Response types
export interface ProjectsApiResponse {
  data: Project[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface ProjectApiResponse {
  data: Project
  success: boolean
  message?: string
}

export interface CreateProjectApiResponse {
  data: Project
  success: boolean
  message: string
}

// Component Props types
export interface ProjectCardProps {
  project: Project
  viewMode?: 'grid' | 'list'
  onEdit?: (project: Project) => void
  onDelete?: (projectId: string) => void
  onView?: (projectId: string) => void
  className?: string
}

export interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (project: Project) => void
  className?: string
}

export interface EditProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (project: Project) => void
  project: Project
  className?: string
}

export interface ProjectsPageProps {
  initialProjects?: Project[]
  className?: string
}

// Search and filter types
export interface ProjectFilters {
  status?: ProjectStatus[] | undefined
  priority?: ProjectPriority[] | undefined
  search?: string | undefined
  dateRange?:
    | {
        start?: string | undefined
        end?: string | undefined
      }
    | undefined
  memberRole?: ('owner' | 'admin' | 'member' | 'viewer')[] | undefined
}

export interface ProjectSortOptions {
  field: 'name' | 'created_at' | 'updated_at' | 'start_date' | 'end_date' | 'priority' | 'status'
  direction: 'asc' | 'desc'
}

// Context types
export interface ProjectsContextState {
  projects: Project[]
  loading: boolean
  error: string | null
  filters: ProjectFilters
  sortOptions: ProjectSortOptions
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

export interface ProjectsContextActions {
  fetchProjects: () => Promise<void>
  createProject: (data: CreateProjectFormData) => Promise<Project>
  updateProject: (id: string, data: Partial<UpdateProjectData>) => Promise<Project>
  deleteProject: (id: string) => Promise<void>
  setFilters: (filters: Partial<ProjectFilters>) => void
  setSortOptions: (options: ProjectSortOptions) => void
  setPage: (page: number) => void
  clearError: () => void
  refreshProjects: () => Promise<void>
}

export interface ProjectsContextValue extends ProjectsContextState, ProjectsContextActions {}

// Hook return types
export type UseProjectsReturn = ProjectsContextValue

export interface UseCreateProjectReturn {
  createProject: (data: CreateProjectFormData) => Promise<Project>
  isLoading: boolean
  error: string | null
  clearError: () => void
}

export interface UseProjectFiltersReturn {
  filters: ProjectFilters
  setFilters: (filters: Partial<ProjectFilters>) => void
  clearFilters: () => void
  hasActiveFilters: boolean
}
