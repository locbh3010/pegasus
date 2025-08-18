/**
 * Comprehensive autofill prevention utilities
 * Provides methods to completely disable browser autofill, autocomplete, and password manager interference
 */

export interface AutofillPreventionAttributes {
  autoComplete: string
  autoCorrect: string
  autoCapitalize: string
  spellCheck: boolean
  'data-form-type': string
  'data-lpignore': string
  'data-1p-ignore': string
  'data-bwignore': string
  'data-dashlane-ignore': string
  'data-keeper-ignore': string
  'data-roboform-ignore': string
  'data-lastpass-ignore': string
  'data-no-autofill': string
}

/**
 * Get comprehensive autofill prevention attributes
 */
export function getAutofillPreventionAttributes(): AutofillPreventionAttributes {
  return {
    autoComplete: 'new-password', // Most aggressive autocomplete prevention
    autoCorrect: 'off',
    autoCapitalize: 'off',
    spellCheck: false,
    'data-form-type': 'other',
    'data-lpignore': 'true', // LastPass
    'data-1p-ignore': 'true', // 1Password
    'data-bwignore': 'true', // Bitwarden
    'data-dashlane-ignore': 'true', // Dashlane
    'data-keeper-ignore': 'true', // Keeper
    'data-roboform-ignore': 'true', // RoboForm
    'data-lastpass-ignore': 'true', // LastPass (alternative)
    'data-no-autofill': 'true', // Generic
  }
}

/**
 * Apply autofill prevention to an input element
 */
export function applyAutofillPrevention(element: HTMLInputElement | HTMLTextAreaElement): void {
  const attributes = getAutofillPreventionAttributes()

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })

  // Additional runtime prevention
  element.addEventListener('focus', preventAutofillOnFocus)
  element.addEventListener('input', preventAutofillOnInput)
}

/**
 * Prevent autofill on focus
 */
function preventAutofillOnFocus(event: Event): void {
  const element = event.target as HTMLInputElement | HTMLTextAreaElement

  // Clear any pre-filled values
  if (element.value && !element.dataset.userInput) {
    element.value = ''
  }

  // Force re-render to prevent autofill
  setTimeout(() => {
    element.style.backgroundColor = 'transparent'
    element.style.color = 'inherit'
  }, 0)
}

/**
 * Track user input to distinguish from autofill
 */
function preventAutofillOnInput(event: Event): void {
  const element = event.target as HTMLInputElement | HTMLTextAreaElement
  element.dataset.userInput = 'true'
}

/**
 * Generate random field names to confuse password managers
 */
export function generateRandomFieldName(prefix: string = 'field'): string {
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  return `${prefix}_${randomSuffix}`
}

/**
 * Create honeypot fields to confuse autofill
 */
export function createHoneypotFields(): HTMLElement[] {
  const honeypots: HTMLElement[] = []

  // Create invisible email honeypot
  const emailHoneypot = document.createElement('input')
  emailHoneypot.type = 'email'
  emailHoneypot.name = generateRandomFieldName('email')
  emailHoneypot.style.cssText =
    'position:absolute;left:-9999px;top:-9999px;opacity:0;pointer-events:none;'
  emailHoneypot.tabIndex = -1
  emailHoneypot.setAttribute('aria-hidden', 'true')
  honeypots.push(emailHoneypot)

  // Create invisible password honeypot
  const passwordHoneypot = document.createElement('input')
  passwordHoneypot.type = 'password'
  passwordHoneypot.name = generateRandomFieldName('password')
  passwordHoneypot.style.cssText =
    'position:absolute;left:-9999px;top:-9999px;opacity:0;pointer-events:none;'
  passwordHoneypot.tabIndex = -1
  passwordHoneypot.setAttribute('aria-hidden', 'true')
  honeypots.push(passwordHoneypot)

  return honeypots
}

/**
 * Disable form autofill completely
 */
export function disableFormAutofill(form: HTMLFormElement): void {
  // Set form attributes
  form.setAttribute('autocomplete', 'off')
  form.setAttribute('data-form-type', 'other')
  form.setAttribute('data-lpignore', 'true')
  form.setAttribute('data-1p-ignore', 'true')
  form.setAttribute('data-bwignore', 'true')

  // Add honeypot fields
  const honeypots = createHoneypotFields()
  honeypots.forEach((honeypot) => {
    form.insertBefore(honeypot, form.firstChild)
  })

  // Apply to all inputs
  const inputs = form.querySelectorAll('input, textarea')
  inputs.forEach((input) => {
    if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
      applyAutofillPrevention(input)
    }
  })
}

/**
 * React hook for autofill prevention
 */
export function useAutofillPrevention() {
  return {
    getAttributes: getAutofillPreventionAttributes,
    applyToElement: applyAutofillPrevention,
    disableFormAutofill,
    generateRandomName: generateRandomFieldName,
  }
}
