import { getPagination } from '@/lib/utils'
import { CreateProjectData, Project, ProjectsQueryParams } from '../types'
import { supabase } from '@/lib/supabase/client'
import { getProjects } from './project.actions'

export const projectServices = {
  getProjects: async (params: ProjectsQueryParams, userId?: string) => getProjects(params, userId),

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
