import ProjectsPage from '@/features/projects/pages/ProjectsPage'

export const metadata = {
    title: 'Pegasus - Projects',
    description: 'Projects page',
    robots: {
        index: false,
        follow: false,
    },
}

export default function page() {
    return <ProjectsPage />
}
