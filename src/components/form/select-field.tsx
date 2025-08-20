'use client'

import { Field, FieldProps } from 'formik'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { SelectFieldProps } from './types'
import { SelectPortal } from '@radix-ui/react-select'

// Form field wrapper component (reused)
interface FormFieldWrapperProps {
    label?: string
    required?: boolean
    error?: string
    helperText?: string
    className?: string
    children: React.ReactNode
    htmlFor?: string
}

function FormFieldWrapper({
    label,
    required,
    error,
    helperText,
    className,
    children,
    htmlFor,
}: FormFieldWrapperProps) {
    return (
        <div className={cn('space-y-2', className)}>
            {label && (
                <Label htmlFor={htmlFor} className="text-foreground mb-2 block text-sm font-medium">
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </Label>
            )}
            {children}
            {error && (
                <p className="text-destructive text-sm" role="alert" aria-live="polite">
                    {error}
                </p>
            )}
            {helperText && !error && <p className="text-muted-foreground text-sm">{helperText}</p>}
        </div>
    )
}

// SelectField component for use with Formik
export function SelectField({
    name,
    label,
    placeholder = 'Select an option...',
    required = false,
    disabled = false,
    error,
    helperText,
    className,
    id,
    options,
    multiple = false,
    loading = false,
    noOptionsMessage = 'No options available',
    ...props
}: SelectFieldProps) {
    const fieldId = id || name

    if (multiple) {
        // TODO: Implement multi-select functionality
        // For now, we'll use single select and add multi-select in a future iteration
        console.warn('Multi-select is not yet implemented. Using single select.')
    }

    return (
        <Field name={name}>
            {({ field, meta, form }: FieldProps) => {
                const hasError = meta.touched && meta.error
                const errorMessage = error || (hasError ? meta.error : undefined)

                const handleValueChange = (value: string) => {
                    form.setFieldValue(name, value)
                    form.setFieldTouched(name, true)
                }

                const wrapperProps: FormFieldWrapperProps = {
                    children: null, // Will be set below
                    required,
                    htmlFor: fieldId,
                }

                if (label) {
                    wrapperProps.label = label
                }
                if (errorMessage) {
                    wrapperProps.error = errorMessage
                }
                if (helperText) {
                    wrapperProps.helperText = helperText
                }
                if (className) {
                    wrapperProps.className = className
                }

                return (
                    <FormFieldWrapper {...wrapperProps}>
                        <Select
                            value={field.value || ''}
                            onValueChange={handleValueChange}
                            disabled={disabled || loading}
                            {...props}
                        >
                            <SelectTrigger
                                id={fieldId}
                                className={cn(
                                    hasError &&
                                        'border-destructive focus:border-destructive focus:ring-destructive',
                                    disabled && 'cursor-not-allowed opacity-50'
                                )}
                                aria-invalid={hasError ? 'true' : 'false'}
                                aria-describedby={
                                    errorMessage || helperText
                                        ? `${fieldId}-description`
                                        : undefined
                                }
                            >
                                <SelectValue placeholder={loading ? 'Loading...' : placeholder} />
                            </SelectTrigger>
                            <SelectPortal container={document.body}>
                                <SelectContent>
                                    {loading ? (
                                        <SelectItem value="" disabled>
                                            Loading...
                                        </SelectItem>
                                    ) : options.length === 0 ? (
                                        <SelectItem value="" disabled>
                                            {noOptionsMessage}
                                        </SelectItem>
                                    ) : (
                                        options.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={String(option.value)}
                                                {...(option.disabled && {
                                                    disabled: option.disabled,
                                                })}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    </FormFieldWrapper>
                )
            }}
        </Field>
    )
}

// Standalone SelectField component (without Formik)
export function StandaloneSelectField({
    name,
    label,
    placeholder = 'Select an option...',
    required = false,
    disabled = false,
    error,
    helperText,
    className,
    id,
    options,
    value,
    onChange,
    loading = false,
    noOptionsMessage = 'No options available',
    ...props
}: Omit<SelectFieldProps, 'name'> & {
    name?: string
    value?: string
    onChange?: (value: string) => void
}) {
    const fieldId = id || name

    const wrapperProps: FormFieldWrapperProps = {
        children: null, // Will be set below
        required,
    }

    if (fieldId) {
        wrapperProps.htmlFor = fieldId
    }
    if (label) {
        wrapperProps.label = label
    }
    if (error) {
        wrapperProps.error = error
    }
    if (helperText) {
        wrapperProps.helperText = helperText
    }
    if (className) {
        wrapperProps.className = className
    }

    return (
        <FormFieldWrapper {...wrapperProps}>
            <Select
                value={value || ''}
                {...(onChange && { onValueChange: onChange })}
                disabled={disabled || loading}
                {...props}
            >
                <SelectTrigger
                    id={fieldId}
                    className={cn(
                        error &&
                            'border-destructive focus:border-destructive focus:ring-destructive',
                        disabled && 'cursor-not-allowed opacity-50'
                    )}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error || helperText ? `${fieldId}-description` : undefined}
                >
                    <SelectValue placeholder={loading ? 'Loading...' : placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {loading ? (
                        <SelectItem value="" disabled>
                            Loading...
                        </SelectItem>
                    ) : options.length === 0 ? (
                        <SelectItem value="" disabled>
                            {noOptionsMessage}
                        </SelectItem>
                    ) : (
                        options.map((option) => (
                            <SelectItem
                                key={option.value}
                                value={String(option.value)}
                                {...(option.disabled && { disabled: option.disabled })}
                            >
                                {option.label}
                            </SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>
        </FormFieldWrapper>
    )
}

export default SelectField
