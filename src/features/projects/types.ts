// Project-related type definitions (UI-only)
import { Pagination, QueryParams } from '@/types/common'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/supabase'

export enum ProjectStatus {
    PLANNING = 'planning',
    ACTIVE = 'active',
    ON_HOLD = 'on_hold',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export enum ProjectPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent',
}

export enum ProjectMemberRole {
    OWNER = 'owner',
    MANAGER = 'manager',
    MEMBER = 'member',
    VIEWER = 'viewer',
}

export type Member = Tables<'project_members'> & {
    role: ProjectMemberRole
    user: Tables<'profiles'>
}

export type MemberInsert = TablesInsert<'project_members'> & {
    role: ProjectMemberRole
}

export type MemberUpdate = TablesUpdate<'project_members'> & {
    role: ProjectMemberRole
}

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

export interface ProjectsQueryParams extends QueryParams, Pagination {
    search?: string
    status?: ProjectStatus[]
    priority?: ProjectPriority[]
}
