import { getPagination } from '@/lib/utils'
import { CreateProjectData, ProjectsQueryParams } from '../types'
import { supabase } from '@/lib/supabase/client'

export const projectServices = {
  getProjects: async (params: ProjectsQueryParams, userId?: string) => {
    const { offset, limit } = getPagination(params.page || 1, params.limit || 10)

    const result = await supabase
      .from('projects')
      .select(
        `*,
      project_members!inner (*, user:users (*))`
      )
      .eq('project_members.user_id', userId!)
      .range(offset, limit)

    if (result.error) {
      throw new Error(result.error.message)
    }

    return result
  },

  insert: async (project: CreateProjectData) => {
    const result = await supabase.from('projects').insert(project).select('*').single()

    if (result.error) {
      throw new Error(result.error.message)
    }

    return result
  },

  delete: (id: string) => {
    return supabase.from('projects').delete().eq('id', id)
  },
}
