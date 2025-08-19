'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Field, FieldProps } from 'formik'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import type { DateFieldProps } from './types'

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

// Utility functions for date handling
const parseDate = (value: string | Date | undefined): Date | undefined => {
  if (!value) return undefined
  if (value instanceof Date) return value
  const parsed = new Date(value)
  return isNaN(parsed.getTime()) ? undefined : parsed
}

const formatDateForInput = (
  date: Date | undefined,
  formatString: string = 'yyyy-MM-dd'
): string => {
  if (!date) return ''
  try {
    return format(date, formatString)
  } catch {
    return ''
  }
}

const formatDateForDisplay = (date: Date | undefined): string => {
  if (!date) return ''
  try {
    return format(date, 'PPP') // e.g., "Jan 1, 2024"
  } catch {
    return ''
  }
}

// DateField component for use with Formik
export function DateField({
  name,
  label,
  placeholder = 'Select a date...',
  required = false,
  disabled = false,
  error,
  helperText,
  className,
  id,
  minDate,
  maxDate,
  format: dateFormat = 'yyyy-MM-dd',
  showTime = false,
  ...props
}: DateFieldProps) {
  const fieldId = id || name
  const [isOpen, setIsOpen] = useState(false)

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
            const formattedDate = formatDateForInput(date, dateFormat)
            form.setFieldValue(name, formattedDate)
            form.setFieldTouched(name, true)
            setIsOpen(false)
          }
        }

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value
          form.setFieldValue(name, value)
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
            <div className="flex gap-2">
              {/* Date Input */}
              <Input
                {...field}
                id={fieldId}
                type="date"
                placeholder={placeholder}
                disabled={disabled}
                onChange={handleInputChange}
                min={parsedMinDate ? formatDateForInput(parsedMinDate, dateFormat) : undefined}
                max={parsedMaxDate ? formatDateForInput(parsedMaxDate, dateFormat) : undefined}
                className={cn(
                  'flex-1',
                  hasError &&
                    'border-destructive focus:border-destructive focus-visible:ring-destructive'
                )}
                aria-invalid={hasError ? 'true' : 'false'}
                aria-describedby={errorMessage || helperText ? `${fieldId}-description` : undefined}
                {...props}
              />

              {/* Calendar Popover */}
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={disabled}
                    className={cn('shrink-0', hasError && 'border-destructive')}
                    aria-label="Open calendar"
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => {
                      if (disabled) return true
                      if (parsedMinDate && date < parsedMinDate) return true
                      if (parsedMaxDate && date > parsedMaxDate) return true
                      return false
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Display formatted date */}
            {selectedDate && (
              <p className="text-muted-foreground text-xs">
                Selected: {formatDateForDisplay(selectedDate)}
              </p>
            )}
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
  placeholder = 'Select a date...',
  required = false,
  disabled = false,
  error,
  helperText,
  className,
  id,
  minDate,
  maxDate,
  format: dateFormat = 'yyyy-MM-dd',
  value,
  onChange,
  ...props
}: Omit<DateFieldProps, 'name'> & {
  name?: string
  value?: string
  onChange?: (value: string) => void
}) {
  const fieldId = id || name
  const [isOpen, setIsOpen] = useState(false)

  const parsedMinDate = parseDate(minDate)
  const parsedMaxDate = parseDate(maxDate)
  const selectedDate = parseDate(value)

  const handleDateSelect = (date: Date | undefined) => {
    if (date && onChange) {
      const formattedDate = formatDateForInput(date, dateFormat)
      onChange(formattedDate)
      setIsOpen(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value)
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
      <div className="flex gap-2">
        {/* Date Input */}
        <Input
          id={fieldId}
          name={name}
          type="date"
          placeholder={placeholder}
          disabled={disabled}
          value={value || ''}
          onChange={handleInputChange}
          min={parsedMinDate ? formatDateForInput(parsedMinDate, dateFormat) : undefined}
          max={parsedMaxDate ? formatDateForInput(parsedMaxDate, dateFormat) : undefined}
          className={cn(
            'flex-1',
            error && 'border-destructive focus:border-destructive focus-visible:ring-destructive'
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error || helperText ? `${fieldId}-description` : undefined}
          {...props}
        />

        {/* Calendar Popover */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              disabled={disabled}
              className={cn('shrink-0', error && 'border-destructive')}
              aria-label="Open calendar"
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => {
                if (disabled) return true
                if (parsedMinDate && date < parsedMinDate) return true
                if (parsedMaxDate && date > parsedMaxDate) return true
                return false
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Display formatted date */}
      {selectedDate && (
        <p className="text-muted-foreground text-xs">
          Selected: {formatDateForDisplay(selectedDate)}
        </p>
      )}
    </FormFieldWrapper>
  )
}

export default DateField
