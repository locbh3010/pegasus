import { ReactNode } from 'react'
import { FieldProps } from 'formik'

// Base form field props that all form components share
export interface BaseFormFieldProps {
    label?: string
    placeholder?: string
    required?: boolean
    readonly?: boolean
    disabled?: boolean
    error?: string
    helperText?: string
    className?: string
    id?: string
    name: string
}

// Extended props for Formik integration
export interface FormikFieldProps extends BaseFormFieldProps {
    field: FieldProps['field']
    meta: FieldProps['meta']
}

// Text field specific props
export interface TextFieldProps extends BaseFormFieldProps {
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
    autoComplete?: string
    maxLength?: number
    minLength?: number
    pattern?: string
}

// Textarea field specific props
export interface TextareaFieldProps extends BaseFormFieldProps {
    rows?: number
    cols?: number
    maxLength?: number
    minLength?: number
    resize?: 'none' | 'both' | 'horizontal' | 'vertical'
    showCharacterCount?: boolean
}

// Select field option type
export interface SelectOption {
    value: string | number
    label: string
    disabled?: boolean
}

// Select field specific props
export interface SelectFieldProps extends BaseFormFieldProps {
    options: SelectOption[]
    multiple?: boolean
    searchable?: boolean
    clearable?: boolean
    loading?: boolean
    noOptionsMessage?: string
}

// Date field specific props
export interface DateFieldProps extends BaseFormFieldProps {
    minDate?: Date | string
    maxDate?: Date | string
    format?: string
    showTime?: boolean
    timeFormat?: '12' | '24'
    timezone?: string
}

// User selection specific props
export interface UserOption {
    value: string
    label: string
    email: string
    avatar?: string | null
    department?: string | null
    position?: string | null
    disabled?: boolean
}

export interface UserSelectFieldProps extends BaseFormFieldProps {
    options: UserOption[]
    multiple?: boolean
    loading?: boolean
    noOptionsMessage?: string
    searchable?: boolean
    clearable?: boolean
    maxSelections?: number
    onSearch?: (query: string) => void
}

// Form field wrapper props
export interface FormFieldWrapperProps {
    label?: string
    required?: boolean
    error?: string
    helperText?: string
    className?: string
    children: ReactNode
    htmlFor?: string
}

// Validation state type
export type ValidationState = 'default' | 'error' | 'success' | 'warning'

// Common form field states
export interface FormFieldState {
    value: unknown
    error?: string
    touched: boolean
    dirty: boolean
    validationState: ValidationState
}

export interface DebounceInputProps {
    id?: string
    label?: string
    placeholder?: string
    required?: boolean
    readonly?: boolean
    disabled?: boolean
    error?: string
    helperText?: string
    className?: string

    debounce?: number
    value?: string
    onChange?: (value: string) => void
    onDebounce?: (value: string) => void
}
