import { ProjectPriority, ProjectStatus } from './types'

export const PROJECT_PRIORITY_MAP: Record<ProjectPriority, { label: string; color: string }> = {
    [ProjectPriority.LOW]: {
        label: 'Low',
        color: 'bg-green-500',
    },
    [ProjectPriority.MEDIUM]: {
        label: 'Medium',
        color: 'bg-yellow-500',
    },
    [ProjectPriority.HIGH]: {
        label: 'High',
        color: 'bg-orange-500',
    },
    [ProjectPriority.URGENT]: {
        label: 'Urgent',
        color: 'bg-red-500',
    },
}

export const PROJECT_STATUS_MAP: Record<ProjectStatus, { label: string; color: string }> = {
    [ProjectStatus.ACTIVE]: {
        label: 'Active',
        color: 'bg-green-500',
    },
    [ProjectStatus.COMPLETED]: {
        label: 'Completed',
        color: 'bg-blue-500',
    },
    [ProjectStatus.CANCELLED]: {
        label: 'Cancelled',
        color: 'bg-red-500',
    },
    [ProjectStatus.ON_HOLD]: {
        label: 'On Hold',
        color: 'bg-yellow-500',
    },
    [ProjectStatus.PLANNING]: {
        label: 'Planning',
        color: 'bg-gray-500',
    },
}
