import { queryOptions } from '@tanstack/react-query'
import { getProjects } from './actions'
import { ProjectsQueryParams } from './types'

export const projectsQueryOptions = (params: ProjectsQueryParams) => {
    return queryOptions({
        queryKey: ['projects', params],
        queryFn: async () => {
            const resp = await getProjects(params)

            if (resp.error) {
                throw new Error(resp.error.message)
            }

            return resp
        },
    })
}
