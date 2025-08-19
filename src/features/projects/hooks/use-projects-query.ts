import { useQuery } from '@tanstack/react-query'
import { projectServices } from '../services/project.services'

export function useProjectsQuery() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => projectServices.getProjects({ page: 1, limit: 10 }),
  })
}
