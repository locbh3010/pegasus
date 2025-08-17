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
  budget?: number | null
  client_name?: string | null
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
