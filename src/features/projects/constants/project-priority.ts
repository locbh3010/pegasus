// Project priority enum
export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

// Legacy constant for backward compatibility
export const PROJECT_PRIORITY = {
  LOW: ProjectPriority.LOW,
  MEDIUM: ProjectPriority.MEDIUM,
  HIGH: ProjectPriority.HIGH,
  URGENT: ProjectPriority.URGENT,
} as const

// Priority display labels
export const PROJECT_PRIORITY_LABELS: Record<ProjectPriority, string> = {
  [ProjectPriority.LOW]: 'Low',
  [ProjectPriority.MEDIUM]: 'Medium',
  [ProjectPriority.HIGH]: 'High',
  [ProjectPriority.URGENT]: 'Urgent',
}

// Priority colors for UI
export const PROJECT_PRIORITY_COLORS: Record<ProjectPriority, string> = {
  [ProjectPriority.LOW]: 'gray',
  [ProjectPriority.MEDIUM]: 'blue',
  [ProjectPriority.HIGH]: 'orange',
  [ProjectPriority.URGENT]: 'red',
}

// Priority options for forms
export const PROJECT_PRIORITY_OPTIONS = Object.values(ProjectPriority).map((value) => ({
  value,
  label: PROJECT_PRIORITY_LABELS[value],
  color: PROJECT_PRIORITY_COLORS[value],
}))
