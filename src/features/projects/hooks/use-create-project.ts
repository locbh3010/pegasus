import { useMutation } from '@tanstack/react-query'
import { projectServices } from '../services/project.services'
import { CreateProjectData } from '../types'

export function useCreateProject() {
  return useMutation({
    mutationFn: async (project: CreateProjectData) => {
      try {
        const { data } = await projectServices.insert(project)

        if (!data?.id) {
          throw new Error('Failed to create project')
        }

        return data
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to create project')
      }
    },
  })
}
