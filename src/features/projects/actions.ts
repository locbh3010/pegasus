'use server'

import { createSsr } from '@/lib/supabase/server'
import { getPagination } from '@/lib/utils'
import { CreateProjectData, Project, ProjectMemberRole, ProjectsQueryParams } from './types'

export const getProjects = async (params: ProjectsQueryParams) => {
    const server = await createSsr()

    const { offset, limit } = getPagination(params.page || 1, params.limit || 10)

    const response = await server
        .from('projects')
        .select(
            `*,
      project_members!inner (*, user:profiles (*))`
        )
        .range(offset, limit)
        .overrideTypes<Project[]>()

    return response
}

export const deleteProject = async (_projectId: string) => {
    const _server = await createSsr()

    return null
}

export const createProject = async (project: CreateProjectData) => {
    const server = await createSsr()

    const { error, data } = await server.from('projects').insert({
        name: project.name,
        description: project.description || null,
        status: project.status,
        priority: project.priority,
    }).select().single()
    console.log('🚀 ~ createProject ~ error:', error)

    return {
        error,
        data,
    }
}
