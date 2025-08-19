'use client'

import { forwardRef } from 'react'
import { Field, FieldProps } from 'formik'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { TextareaFieldProps } from './types'

// Form field wrapper component (reused from text-field)
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

// Character counter component
interface CharacterCounterProps {
  current: number
  max?: number
  className?: string
}

function CharacterCounter({ current, max, className }: CharacterCounterProps) {
  if (!max) {
    return null
  }

  const isNearLimit = current > max * 0.8
  const isOverLimit = current > max

  return (
    <div
      className={cn(
        'text-right text-xs',
        isOverLimit ? 'text-destructive' : isNearLimit ? 'text-warning' : 'text-muted-foreground',
        className
      )}
    >
      {current}/{max}
    </div>
  )
}

// TextareaField component for use with Formik
export function TextareaField({
  name,
  label,
  placeholder,
  required = false,
  readonly = false,
  disabled = false,
  error,
  helperText,
  className,
  id,
  rows = 3,
  cols,
  maxLength,
  minLength,
  resize = 'vertical',
  showCharacterCount = false,
  ...props
}: TextareaFieldProps) {
  const fieldId = id || name

  return (
    <Field name={name}>
      {({ field, meta }: FieldProps) => {
        const hasError = meta.touched && meta.error
        const errorMessage = error || (hasError ? meta.error : undefined)
        const currentLength = field.value?.length || 0

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
            <div className="space-y-1">
              <Textarea
                {...field}
                id={fieldId}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readonly}
                rows={rows}
                cols={cols}
                maxLength={maxLength}
                minLength={minLength}
                className={cn(
                  hasError &&
                    'border-destructive focus:border-destructive focus-visible:ring-destructive',
                  readonly && 'bg-muted cursor-default',
                  resize === 'none' && 'resize-none',
                  resize === 'horizontal' && 'resize-x',
                  resize === 'vertical' && 'resize-y',
                  resize === 'both' && 'resize'
                )}
                aria-invalid={hasError ? 'true' : 'false'}
                aria-describedby={errorMessage || helperText ? `${fieldId}-description` : undefined}
                {...props}
              />
              {showCharacterCount && maxLength && (
                <CharacterCounter current={currentLength} max={maxLength} />
              )}
            </div>
          </FormFieldWrapper>
        )
      }}
    </Field>
  )
}

// Standalone TextareaField component (without Formik)
export const StandaloneTextareaField = forwardRef<
  HTMLTextAreaElement,
  Omit<TextareaFieldProps, 'name'> & {
    name?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  }
>(
  (
    {
      name,
      label,
      placeholder,
      required = false,
      readonly = false,
      disabled = false,
      error,
      helperText,
      className,
      id,
      rows = 3,
      cols,
      maxLength,
      minLength,
      resize = 'vertical',
      showCharacterCount = false,
      value,
      onChange,
      onBlur,
      ...props
    },
    ref
  ) => {
    const fieldId = id || name
    const currentLength = value?.length || 0

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
        <div className="space-y-1">
          <Textarea
            ref={ref}
            id={fieldId}
            name={name}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readonly}
            rows={rows}
            cols={cols}
            maxLength={maxLength}
            minLength={minLength}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={cn(
              error && 'border-destructive focus:border-destructive focus-visible:ring-destructive',
              readonly && 'bg-muted cursor-default',
              resize === 'none' && 'resize-none',
              resize === 'horizontal' && 'resize-x',
              resize === 'vertical' && 'resize-y',
              resize === 'both' && 'resize'
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error || helperText ? `${fieldId}-description` : undefined}
            {...props}
          />
          {showCharacterCount && maxLength && (
            <CharacterCounter current={currentLength} max={maxLength} />
          )}
        </div>
      </FormFieldWrapper>
    )
  }
)

StandaloneTextareaField.displayName = 'StandaloneTextareaField'

export default TextareaField
