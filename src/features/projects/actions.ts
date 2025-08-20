'use server'

import { createSsr } from '@/lib/supabase/server'
import { getPagination } from '@/lib/utils'
import { Project, ProjectsQueryParams } from './types'

export const getProjects = async (params: ProjectsQueryParams) => {
    const server = await createSsr()
    const {
        data: { user },
    } = await server.auth.getUser()

    if (!user) {
        return {
            error: {
                message: 'User not found',
            },
            status: 401,
            data: null,
        }
    }

    const { offset, limit } = getPagination(params.page || 1, params.limit || 10)

    const response = await server
        .from('projects')
        .select(
            `*,
      project_members!inner (*, user:profiles (*))`
        )
        .eq('project_members.user_id', user.id)
        .range(offset, limit)
        .overrideTypes<Project[]>()

    return response
}

export const deleteProject = async (projectId: string) => {
    const server = await createSsr()

    return null
}
