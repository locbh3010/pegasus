import { useAuth } from '@/features/auth'
import { useQuery } from '@tanstack/react-query'
import { projectServices } from '../services/project.services'
import { ProjectsQueryParams } from '../types'

export function useProjectsQuery(params: ProjectsQueryParams) {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['projects', params, user?.id],
    queryFn: () => projectServices.getProjects(params, user?.id),
    enabled: !!user,
  })
}
