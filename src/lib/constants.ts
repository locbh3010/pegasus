// Application constants

export const APP_NAME = 'Task Manager' as const

export const ROUTES = {
  HOME: '/',
  TASKS: '/tasks',
  PROJECTS: '/projects',
  SETTINGS: '/settings',
} as const

export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const

export const PRIORITY_COLORS = {
  [TASK_PRIORITIES.LOW]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [TASK_PRIORITIES.MEDIUM]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [TASK_PRIORITIES.HIGH]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
} as const

export const DEFAULT_PAGE_SIZE = 10 as const

export const STORAGE_KEYS = {
  THEME: 'task-manager-theme',
  USER_PREFERENCES: 'task-manager-preferences',
} as const
