import { useQuery } from '@tanstack/react-query'
import { projectServices } from '../services/project.services'
import { ProjectsQueryParams } from '../types'

export function useProjectsQuery(params: ProjectsQueryParams) {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => projectServices.getProjects(params),
  })
}
