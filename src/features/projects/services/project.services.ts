import { supabaseService } from '@/lib/supabase/service'
import { getPagination } from '@/lib/utils'
import { CreateProjectData, ProjectsQueryParams } from '../types'
import { projectTransformers } from '../project.transformers'

export const projectServices = {
  getProjects: async (params: ProjectsQueryParams) => {
    const { offset, limit } = getPagination(params.page || 1, params.limit || 10)

    const result = await supabaseService.from('projects').select('*').range(offset, limit)

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
