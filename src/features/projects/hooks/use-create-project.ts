import { MemberRole } from '@/features/members/member.types'
import { memberServices } from '@/features/members/services/member.services'
import { useMutation } from '@tanstack/react-query'
import { projectServices } from '../services/project.services'
import { CreateProjectData } from '../types'

export function useCreateProject() {
  return useMutation({
    mutationFn: async (project: CreateProjectData) => {
      try {
        const { data } = await projectServices.insert(project)

        if (!data?.id) throw new Error('Failed to create project')

        const { error: memberError } = await memberServices.insert({
          project_id: data.id,
          user_id: project.created_by,
          role: MemberRole.OWNER,
        })

        // * has member error to remove project
        if (memberError) {
          await projectServices.delete(data.id)
          throw new Error(memberError.message)
        }

        return data
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to create project')
      }
    },
  })
}
