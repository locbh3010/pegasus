'use server'

import { getAuthToken } from '@/lib/server-actions'
import { createSsr } from '@/lib/supabase/server'
import { getPagination } from '@/lib/utils'
import { Project, ProjectsQueryParams } from './types'

export const getProjects = async (params: ProjectsQueryParams, userId?: string) => {
  const server = await createSsr()

  const { offset, limit } = getPagination(params.page || 1, params.limit || 10)

  const response = await server
    .from('projects')
    .select(
      `*,
      project_members!inner (*, user:profiles (*))`
    )
    .eq('project_members.user_id', userId!)
    .range(offset, limit)
    .overrideTypes<Project[]>()

  return response
}

export const deleteProject = async (projectId: string) => {
  const server = await createSsr()

  const user = await server.auth.getUser()
  console.log('🚀 ~ deleteProject ~ user:', user)

  return null
}
