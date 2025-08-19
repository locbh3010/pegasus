'use client'

import { forwardRef } from 'react'
import { Field, FieldProps } from 'formik'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { TextFieldProps } from './types'

// Form field wrapper component
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

// TextField component for use with Formik
export function TextField({
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
  type = 'text',
  autoComplete,
  maxLength,
  minLength,
  pattern,
  ...props
}: TextFieldProps) {
  const fieldId = id || name

  return (
    <Field name={name}>
      {({ field, meta }: FieldProps) => {
        const hasError = meta.touched && meta.error
        const errorMessage = error || (hasError ? meta.error : undefined)

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
            <Input
              {...field}
              id={fieldId}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              readOnly={readonly}
              autoComplete={autoComplete}
              maxLength={maxLength}
              minLength={minLength}
              pattern={pattern}
              className={cn(
                hasError &&
                  'border-destructive focus:border-destructive focus-visible:ring-destructive',
                readonly && 'bg-muted cursor-default'
              )}
              aria-invalid={hasError ? 'true' : 'false'}
              aria-describedby={errorMessage || helperText ? `${fieldId}-description` : undefined}
              {...props}
            />
          </FormFieldWrapper>
        )
      }}
    </Field>
  )
}

// Standalone TextField component (without Formik)
export const StandaloneTextField = forwardRef<
  HTMLInputElement,
  Omit<TextFieldProps, 'name'> & {
    name?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
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
      type = 'text',
      autoComplete,
      maxLength,
      minLength,
      pattern,
      value,
      onChange,
      onBlur,
      ...props
    },
    ref
  ) => {
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
        <Input
          ref={ref}
          id={fieldId}
          name={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readonly}
          autoComplete={autoComplete}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={cn(
            error && 'border-destructive focus:border-destructive focus-visible:ring-destructive',
            readonly && 'bg-muted cursor-default'
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error || helperText ? `${fieldId}-description` : undefined}
          {...props}
        />
      </FormFieldWrapper>
    )
  }
)

StandaloneTextField.displayName = 'StandaloneTextField'

export default TextField
