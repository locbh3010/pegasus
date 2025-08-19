import { supabaseService } from '@/lib/supabase/service'
import { getPagination } from '@/lib/utils'
import { CreateProjectData, ProjectsQueryParams, Project } from '../types'
import { ProjectPriority } from '../constants/project-priority'
import { ProjectStatus } from '../constants/project-status'
import type { Tables } from '@/types/supabase'

// Transform raw database project to typed Project
function transformProject(rawProject: Tables<'projects'>): Project {
  return {
    ...rawProject,
    priority: rawProject.priority as ProjectPriority,
    status: rawProject.status as ProjectStatus,
  }
}

export const projectServices = {
  getProjects: async (params: ProjectsQueryParams) => {
    const { offset, limit } = getPagination(params.page || 1, params.limit || 10)

    const result = await supabaseService.from('projects').select('*').range(offset, limit)

    if (result.error) {
      throw new Error(result.error.message)
    }

    return {
      ...result,
      data: result.data?.map(transformProject) || [],
    }
  },

  insert: async (project: CreateProjectData) => {
    const result = await supabaseService.from('projects').insert(project).select('*').single()

    if (result.error) {
      throw new Error(result.error.message)
    }

    return {
      ...result,
      data: result.data ? transformProject(result.data) : null,
    }
  },

  delete: (id: string) => {
    return supabaseService.from('projects').delete().eq('id', id)
  },
}
