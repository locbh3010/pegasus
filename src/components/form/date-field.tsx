'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { PopoverPortal } from '@radix-ui/react-popover'
import dayjs from 'dayjs'
import { Field, FieldProps } from 'formik'
import { CalendarIcon, X } from 'lucide-react'
import * as React from 'react'
import type { DateFieldProps } from './types'

// Form field wrapper component
interface FormFieldWrapperProps {
    label?: string | undefined
    required?: boolean
    error?: string | undefined
    helperText?: string | undefined
    className?: string | undefined
    children: React.ReactNode
    htmlFor?: string | undefined
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

// Utility functions for date handling
const parseDate = (value: string | Date | undefined): Date | undefined => {
    if (!value) {
        return undefined
    }
    if (value instanceof Date) {
        return value
    }
    const parsed = new Date(value)
    return isNaN(parsed.getTime()) ? undefined : parsed
}

const formatDateForInput = (date: Date | undefined): string => {
    if (!date) {
        return ''
    }
    try {
        return dayjs(date).format('YYYY-MM-DD')
    } catch {
        return ''
    }
}

// DateField component for use with Formik
export function DateField({
    name,
    label,
    placeholder = 'Pick a date',
    required = false,
    disabled = false,
    error,
    helperText,
    className,
    id,
    minDate,
    maxDate,
}: DateFieldProps) {
    const fieldId = id || name

    const parsedMinDate = parseDate(minDate)
    const parsedMaxDate = parseDate(maxDate)

    return (
        <Field name={name}>
            {({ field, meta, form }: FieldProps) => {
                const hasError = meta.touched && meta.error
                const errorMessage = error || (hasError ? meta.error : undefined)
                const selectedDate = parseDate(field.value)

                const handleDateSelect = (date: Date | undefined) => {
                    if (date) {
                        const formattedDate = formatDateForInput(date)
                        form.setFieldValue(name, formattedDate)
                        form.setFieldTouched(name, true)
                    }
                }

                const handleReset = (e: React.MouseEvent<HTMLElement>) => {
                    e.preventDefault()
                    form.setFieldValue(name, '')
                    form.setFieldTouched(name, true)
                }

                return (
                    <FormFieldWrapper
                        label={label}
                        required={required}
                        error={errorMessage}
                        helperText={helperText}
                        className={className}
                        htmlFor={fieldId}
                    >
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="relative w-full">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        mode="input"
                                        placeholder={!selectedDate}
                                        className={cn(
                                            'w-full justify-start text-left font-normal',
                                            !selectedDate && 'text-muted-foreground',
                                            hasError &&
                                                'border-destructive focus:border-destructive'
                                        )}
                                        disabled={disabled}
                                        aria-invalid={hasError ? 'true' : 'false'}
                                        aria-describedby={
                                            errorMessage || helperText
                                                ? `${fieldId}-description`
                                                : undefined
                                        }
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {selectedDate ? (
                                            dayjs(selectedDate).format('MMMM D, YYYY')
                                        ) : (
                                            <span>{placeholder}</span>
                                        )}
                                    </Button>
                                    {selectedDate && !disabled && (
                                        <Button
                                            type="button"
                                            variant="dim"
                                            size="sm"
                                            className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 p-0"
                                            onClick={handleReset}
                                            aria-label="Clear date"
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                            </PopoverTrigger>
                            <PopoverPortal container={document.body}>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={handleDateSelect}
                                        disabled={(date) => {
                                            if (disabled) {
                                                return true
                                            }
                                            if (parsedMinDate && date < parsedMinDate) {
                                                return true
                                            }
                                            if (parsedMaxDate && date > parsedMaxDate) {
                                                return true
                                            }
                                            return false
                                        }}
                                        autoFocus
                                    />
                                </PopoverContent>
                            </PopoverPortal>
                        </Popover>
                    </FormFieldWrapper>
                )
            }}
        </Field>
    )
}

// Standalone DateField component (without Formik)
export function StandaloneDateField({
    name,
    label,
    placeholder = 'Pick a date',
    required = false,
    disabled = false,
    error,
    helperText,
    className,
    id,
    minDate,
    maxDate,
    value,
    onChange,
}: Omit<DateFieldProps, 'name'> & {
    name?: string
    value?: string
    onChange?: (value: string) => void
}) {
    const fieldId = id || name

    const parsedMinDate = parseDate(minDate)
    const parsedMaxDate = parseDate(maxDate)
    const selectedDate = parseDate(value)

    const handleDateSelect = (date: Date | undefined) => {
        if (date && onChange) {
            const formattedDate = formatDateForInput(date)
            onChange(formattedDate)
        }
    }

    const handleReset = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        if (onChange) {
            onChange('')
        }
    }

    return (
        <FormFieldWrapper
            label={label}
            required={required}
            error={error}
            helperText={helperText}
            className={className}
            htmlFor={fieldId}
        >
            <Popover>
                <PopoverTrigger asChild className="!mb-0">
                    <div className="relative !mb-0 w-full">
                        <Button
                            type="button"
                            variant="outline"
                            mode="input"
                            placeholder={!selectedDate}
                            className={cn(
                                'w-full justify-start text-left font-normal !ring-0 !ring-offset-0',
                                !selectedDate && 'text-muted-foreground'
                            )}
                            disabled={disabled}
                            aria-invalid={error ? 'true' : 'false'}
                            aria-describedby={
                                error || helperText ? `${fieldId}-description` : undefined
                            }
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? (
                                dayjs(selectedDate).format('MMMM D, YYYY')
                            ) : (
                                <span>{placeholder}</span>
                            )}
                        </Button>
                        {selectedDate && !disabled && (
                            <Button
                                type="button"
                                variant="dim"
                                size="sm"
                                className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 p-0"
                                onClick={handleReset}
                                aria-label="Clear date"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                </PopoverTrigger>
                <PopoverPortal container={document.body}>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            disabled={(date) => {
                                if (disabled) {
                                    return true
                                }
                                if (parsedMinDate && date < parsedMinDate) {
                                    return true
                                }
                                if (parsedMaxDate && date > parsedMaxDate) {
                                    return true
                                }
                                return false
                            }}
                            autoFocus
                        />
                    </PopoverContent>
                </PopoverPortal>
            </Popover>
        </FormFieldWrapper>
    )
}

export default DateField
