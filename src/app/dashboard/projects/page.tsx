import ProjectsPage from '@/features/projects/pages/ProjectsPage'
import { ProjectsProvider } from '@/features/projects/context'

export default function page() {
  return (
    <ProjectsProvider>
      <ProjectsPage />
    </ProjectsProvider>
  )
}
