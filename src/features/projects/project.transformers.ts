/**
 * Project-specific transformers using the generic transform utilities
 */

import {
  createEnumTransformer,
  createTransformer,
  dateTransformers,
  numberTransformers,
} from '@/lib/transform'
import type { Tables } from '@/types/supabase'
import { ProjectPriority } from './constants/project-priority'
import { ProjectStatus } from './constants/project-status'
import type { CreateProjectData, Project } from './types'

/**
 * Transform raw database project to typed Project
 */
export const transformProject = createTransformer<Tables<'projects'>, Project>({
  priority: createEnumTransformer(ProjectPriority, ProjectPriority.MEDIUM),
  status: createEnumTransformer(ProjectStatus, ProjectStatus.PLANNING),
})

/**
 * Transform project for database insertion
 * Converts application types back to database-compatible types
 */
export const transformProjectForDB = createTransformer<CreateProjectData, Tables<'projects'>>({
  priority: (value: ProjectPriority) => value as string,
  status: (value: ProjectStatus) => value as string,
  start_date: (value: string | null | undefined) => value || null,
  end_date: (value: string | null | undefined) => value || null,
  budget: (value: number | null | undefined) => value ?? null,
})

/**
 * Transform project for display purposes
 * Adds computed fields and formatting
 */
export interface ProjectDisplay extends Project {
  formattedBudget: string
  formattedStartDate: string | null
  formattedEndDate: string | null
  durationDays: number | null
  isOverdue: boolean
  priorityLabel: string
  statusLabel: string
}

export const transformProjectForDisplay = createTransformer<Project, ProjectDisplay>({
  formattedBudget: (project: Project) => numberTransformers.toCurrency(project.budget),

  formattedStartDate: (project: Project) => dateTransformers.toDateString(project.start_date),

  formattedEndDate: (project: Project) => dateTransformers.toDateString(project.end_date),

  durationDays: (project: Project) => {
    if (!project.start_date || !project.end_date) {
      return null
    }
    const start = new Date(project.start_date)
    const end = new Date(project.end_date)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  },

  isOverdue: (project: Project) => {
    if (!project.end_date || project.status === ProjectStatus.COMPLETED) {
      return false
    }
    return new Date(project.end_date) < new Date()
  },

  priorityLabel: (project: Project) => {
    const labels = {
      [ProjectPriority.LOW]: 'Low',
      [ProjectPriority.MEDIUM]: 'Medium',
      [ProjectPriority.HIGH]: 'High',
      [ProjectPriority.URGENT]: 'Urgent',
    }
    return labels[project.priority]
  },

  statusLabel: (project: Project) => {
    const labels = {
      [ProjectStatus.PLANNING]: 'Planning',
      [ProjectStatus.ACTIVE]: 'Active',
      [ProjectStatus.ON_HOLD]: 'On Hold',
      [ProjectStatus.COMPLETED]: 'Completed',
      [ProjectStatus.CANCELLED]: 'Cancelled',
    }
    return labels[project.status]
  },
})

/**
 * Transform project for API responses
 * Includes only safe fields for client consumption
 */
export interface ProjectAPI {
  id: string
  name: string
  description: string | null
  status: ProjectStatus
  priority: ProjectPriority
  start_date: string | null
  end_date: string | null
  budget: number | null
  client_name: string | null
  created_at: string | null
  updated_at: string | null
}

export const transformProjectForAPI = createTransformer<Project, ProjectAPI>({
  // All fields are already compatible, no transformation needed
  // This transformer serves as a type guard and documentation
})

/**
 * Batch transformers for arrays
 */
export const projectTransformers = {
  /**
   * Transform array of raw projects to typed Projects
   */
  fromDatabase: (projects: Tables<'projects'>[]): Project[] => projects.map(transformProject),

  /**
   * Transform array of projects for display
   */
  forDisplay: (projects: Project[]): ProjectDisplay[] => projects.map(transformProjectForDisplay),

  /**
   * Transform array of projects for API
   */
  forAPI: (projects: Project[]): ProjectAPI[] => projects.map(transformProjectForAPI),

  /**
   * Transform array of projects for database insertion
   */
  forDatabase: (projects: CreateProjectData[]): Tables<'projects'>[] =>
    projects.map(transformProjectForDB),
}

/**
 * Validation transformers
 */
export const projectValidators = {
  /**
   * Validate and transform project priority
   */
  validatePriority: createEnumTransformer(ProjectPriority, ProjectPriority.MEDIUM),

  /**
   * Validate and transform project status
   */
  validateStatus: createEnumTransformer(ProjectStatus, ProjectStatus.PLANNING),

  /**
   * Validate project dates
   */
  validateDates: (project: Partial<Project>) => {
    const errors: string[] = []

    if (project.start_date && project.end_date) {
      const start = new Date(project.start_date)
      const end = new Date(project.end_date)

      if (start > end) {
        errors.push('Start date must be before end date')
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  },
}
