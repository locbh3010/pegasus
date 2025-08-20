import { useAuth } from '@/features/auth'
import { useQuery } from '@tanstack/react-query'
import { ProjectsQueryParams } from '../types'
import { getProjects } from '../actions'

export function useProjectsQuery(params: ProjectsQueryParams) {
    const { user } = useAuth()

    return useQuery({
        queryKey: ['projects', params, user?.id],
        queryFn: async () => {
            const resp = await getProjects(params)

            if (resp.error) throw new Error(resp.error.message)

            return resp
        },
        enabled: !!user?.id,
    })
}
