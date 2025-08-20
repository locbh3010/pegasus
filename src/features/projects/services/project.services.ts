import { supabaseService } from '@/lib/supabase/service'
import { getPagination } from '@/lib/utils'
import { projectTransformers } from '../project.transformers'
import { CreateProjectData, ProjectsQueryParams } from '../types'

export const projectServices = {
  getProjects: async (params: ProjectsQueryParams, userId?: string) => {
    const { offset, limit } = getPagination(params.page || 1, params.limit || 10)

    const result = await supabaseService
      .from('projects')
      .select(
        `*,
      project_members!inner (*, users:user (*))`
      )
      .eq('project_members.user_id', userId!)
      .range(offset, limit)

    if (result.error) {
      throw new Error(result.error.message)
    }

    return {
      ...result,
      data: result.data ? projectTransformers.fromDatabase(result.data) : [],
    }
  },

  insert: async (project: CreateProjectData) => {
    const result = await supabaseService.from('projects').insert(project).select('*').single()

    if (result.error) {
      throw new Error(result.error.message)
    }

    return {
      ...result,
      data: result.data ? projectTransformers.fromDatabase([result.data])[0] : null,
    }
  },

  delete: (id: string) => {
    return supabaseService.from('projects').delete().eq('id', id)
  },
}
