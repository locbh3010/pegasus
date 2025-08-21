import { useMutation } from '@tanstack/react-query'
import { createProject } from '../actions'
import { CreateProjectData } from '../types'

export function useCreateProject() {
    return useMutation({
        mutationFn: async (project: CreateProjectData) => {
            const { error, data } = await createProject(project)

            if (error) {
                throw new Error(error.message)
            }

            return data
        },
    })
}
