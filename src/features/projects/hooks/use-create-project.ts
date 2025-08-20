import { useMutation } from '@tanstack/react-query'
import { CreateProjectData } from '../types'

export function useCreateProject() {
    return useMutation({
        mutationFn: async (_project: CreateProjectData) => {},
    })
}
