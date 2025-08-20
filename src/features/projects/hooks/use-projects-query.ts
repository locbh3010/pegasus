import { useAuth } from '@/features/auth'
import { useQuery } from '@tanstack/react-query'
import { getProjects } from '../services/project.actions'
import { ProjectsQueryParams } from '../types'

export function useProjectsQuery(params: ProjectsQueryParams) {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['projects', params, user?.id],
    queryFn: async () => {
      const resp = await getProjects(params, user?.id)
      console.log('🚀 ~ useProjectsQuery ~ resp:', resp)

      if (resp.error) throw new Error(resp.error.message)

      return resp
    },
    enabled: !!user?.id,
  })
}
