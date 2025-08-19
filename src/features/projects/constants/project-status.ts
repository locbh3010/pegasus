// Project status enum
export enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Legacy constant for backward compatibility
export const PROJECT_STATUS = {
  PLANNING: ProjectStatus.PLANNING,
  ACTIVE: ProjectStatus.ACTIVE,
  ON_HOLD: ProjectStatus.ON_HOLD,
  COMPLETED: ProjectStatus.COMPLETED,
  CANCELLED: ProjectStatus.CANCELLED,
} as const

// Status display labels
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  [ProjectStatus.PLANNING]: 'Planning',
  [ProjectStatus.ACTIVE]: 'Active',
  [ProjectStatus.ON_HOLD]: 'On Hold',
  [ProjectStatus.COMPLETED]: 'Completed',
  [ProjectStatus.CANCELLED]: 'Cancelled',
}

// Status colors for UI
export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  [ProjectStatus.PLANNING]: 'blue',
  [ProjectStatus.ACTIVE]: 'green',
  [ProjectStatus.ON_HOLD]: 'yellow',
  [ProjectStatus.COMPLETED]: 'purple',
  [ProjectStatus.CANCELLED]: 'red',
}

// Status options for forms
export const PROJECT_STATUS_OPTIONS = Object.values(ProjectStatus).map((value) => ({
  value,
  label: PROJECT_STATUS_LABELS[value],
  color: PROJECT_STATUS_COLORS[value],
}))
