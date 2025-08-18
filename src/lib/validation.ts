/**
 * Validation utilities for authentication forms
 */

export interface ValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }

  return { isValid: true }
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'Password is required' }
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' }
  }

  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' }
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' }
  }

  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' }
  }

  if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character' }
  }

  return { isValid: true }
}

/**
 * Validate username format
 */
export function validateUsername(username: string): ValidationResult {
  if (!username.trim()) {
    return { isValid: false, error: 'Username is required' }
  }

  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters long' }
  }

  if (username.length > 30) {
    return { isValid: false, error: 'Username must be no more than 30 characters long' }
  }

  const usernameRegex = /^[a-zA-Z0-9_]+$/
  if (!usernameRegex.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, and underscores' }
  }

  if (username.startsWith('_') || username.endsWith('_')) {
    return { isValid: false, error: 'Username cannot start or end with an underscore' }
  }

  return { isValid: true }
}

/**
 * Get password strength level
 */
export function getPasswordStrength(password: string): {
  level: 'weak' | 'medium' | 'strong' | 'very-strong'
  score: number
  feedback: string[]
} {
  let score = 0
  const feedback: string[] = []

  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('Use at least 8 characters')
  }

  if (password.length >= 12) {
    score += 1
  } else if (password.length >= 8) {
    feedback.push('Consider using 12+ characters for better security')
  }

  if (/(?=.*[a-z])/.test(password)) {
    score += 1
  } else {
    feedback.push('Add lowercase letters')
  }

  if (/(?=.*[A-Z])/.test(password)) {
    score += 1
  } else {
    feedback.push('Add uppercase letters')
  }

  if (/(?=.*\d)/.test(password)) {
    score += 1
  } else {
    feedback.push('Add numbers')
  }

  if (/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
    score += 1
  } else {
    feedback.push('Add special characters')
  }

  let level: 'weak' | 'medium' | 'strong' | 'very-strong'
  if (score <= 2) {
    level = 'weak'
  } else if (score <= 3) {
    level = 'medium'
  } else if (score <= 4) {
    level = 'strong'
  } else {
    level = 'very-strong'
  }

  return { level, score, feedback }
}

/**
 * Debounce function for real-time validation
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
