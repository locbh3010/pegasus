// Application constants

export const APP_NAME = 'Project Manager' as const

export const ROUTES = {
  HOME: '/',
  PROJECTS: '/projects',
  SETTINGS: '/settings',
} as const

export const DEFAULT_PAGE_SIZE = 10 as const

export const STORAGE_KEYS = {
  THEME: 'project-manager-theme',
  USER_PREFERENCES: 'project-manager-preferences',
} as const
