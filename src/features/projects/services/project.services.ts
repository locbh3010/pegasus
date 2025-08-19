import { supabaseService } from '@/lib/supabase/service'
import { getPagination } from '@/lib/utils'
import { CreateProjectData, ProjectsQueryParams } from '../types'

export const projectServices = {
  getProjects: (params: ProjectsQueryParams) => {
    const { offset, limit } = getPagination(params.page || 1, params.limit || 10)

    return supabaseService.from('projects').select('*').range(offset, limit)
  },

  insert: (project: CreateProjectData) => {
    return supabaseService.from('projects').insert(project).select('*').single()
  },

  delete: (id: string) => {
    return supabaseService.from('projects').delete().eq('id', id)
  },
}
