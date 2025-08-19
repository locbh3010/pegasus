'use client'

import * as React from 'react'
import { Field, FieldProps } from 'formik'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Check, ChevronDown, X } from 'lucide-react'
import type { UserSelectFieldProps } from './types'
import { useUsers } from '@/features/users'

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
        <Label htmlFor={htmlFor} className="text-foreground text-sm font-medium">
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

// UserSelectField component for use with Formik
export function UserSelectField({
  name,
  label,
  placeholder = 'Select users...',
  required = false,
  disabled = false,
  error,
  helperText,
  className,
  id,
  multiple = false,
  noOptionsMessage = 'No users found',
  searchable = true,
  clearable = true,
  maxSelections,
}: Omit<UserSelectFieldProps, 'options' | 'loading' | 'onSearch'>) {
  const fieldId = id || name
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')

  // Use TanStack Query to fetch users only when dropdown is open
  const usersOptions: { enabled: boolean; searchQuery?: string } = {
    enabled: open, // Only fetch when dropdown is open
  }

  const trimmedQuery = searchQuery.trim()
  if (trimmedQuery) {
    usersOptions.searchQuery = trimmedQuery
  }

  const { userOptions, isLoading } = useUsers(usersOptions)

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) {
      return userOptions
    }
    return userOptions.filter(
      (option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [userOptions, searchQuery])

  return (
    <Field name={name}>
      {({ field, meta, form }: FieldProps) => {
        const hasError = meta.touched && meta.error
        const errorMessage = error || (hasError ? meta.error : undefined)

        const selectedValues = Array.isArray(field.value)
          ? field.value
          : field.value
            ? [field.value]
            : []
        const selectedOptions = userOptions.filter((option) =>
          selectedValues.includes(option.value)
        )

        const handleSelect = (optionValue: string) => {
          if (multiple) {
            const newValues = selectedValues.includes(optionValue)
              ? selectedValues.filter((v) => v !== optionValue)
              : maxSelections && selectedValues.length >= maxSelections
                ? selectedValues
                : [...selectedValues, optionValue]

            form.setFieldValue(name, newValues)
          } else {
            form.setFieldValue(name, optionValue)
            setOpen(false)
          }
          form.setFieldTouched(name, true)
        }

        const handleRemove = (optionValue: string) => {
          if (multiple) {
            const newValues = selectedValues.filter((v) => v !== optionValue)
            form.setFieldValue(name, newValues)
          } else {
            form.setFieldValue(name, '')
          }
          form.setFieldTouched(name, true)
        }

        const handleClear = () => {
          form.setFieldValue(name, multiple ? [] : '')
          form.setFieldTouched(name, true)
        }

        const handleSearchChange = (value: string) => {
          setSearchQuery(value)
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
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    'h-auto min-h-10 w-full justify-between',
                    hasError &&
                      'border-destructive focus:border-destructive focus-visible:ring-destructive'
                  )}
                  disabled={disabled}
                  aria-invalid={hasError ? 'true' : 'false'}
                  aria-describedby={
                    errorMessage || helperText ? `${fieldId}-description` : undefined
                  }
                >
                  <div className="flex flex-1 flex-wrap gap-1">
                    {selectedOptions.length > 0 ? (
                      selectedOptions.map((option) => (
                        <Badge
                          key={option.value}
                          variant="secondary"
                          className="flex items-center gap-1 pr-1"
                        >
                          <Avatar className="h-4 w-4">
                            <AvatarImage src={option.avatar || undefined} />
                            <AvatarFallback className="text-xs">
                              {option.label
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{option.label}</span>
                          {!disabled && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-3 w-3 p-0 hover:bg-transparent"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleRemove(option.value)
                              }}
                            >
                              <X className="h-2 w-2" />
                            </Button>
                          )}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">{placeholder}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {clearable && selectedOptions.length > 0 && !disabled && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleClear()
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  {searchable && (
                    <CommandInput
                      placeholder="Search users..."
                      value={searchQuery}
                      onValueChange={handleSearchChange}
                    />
                  )}
                  <CommandList>
                    <CommandEmpty>{isLoading ? 'Loading...' : noOptionsMessage}</CommandEmpty>
                    <CommandGroup>
                      {filteredOptions.map((option) => {
                        const isSelected = selectedValues.includes(option.value)
                        const isDisabled =
                          option.disabled ||
                          (maxSelections && !isSelected && selectedValues.length >= maxSelections)

                        return (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={() => !isDisabled && handleSelect(option.value)}
                            {...(isDisabled && { disabled: true })}
                            className="flex items-center gap-2"
                          >
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={option.avatar || undefined} />
                              <AvatarFallback className="text-xs">
                                {option.label
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-medium">{option.label}</div>
                              <div className="text-muted-foreground text-xs">{option.email}</div>
                              {option.department && (
                                <div className="text-muted-foreground text-xs">
                                  {option.department}
                                </div>
                              )}
                            </div>
                            {isSelected && <Check className="h-4 w-4" />}
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormFieldWrapper>
        )
      }}
    </Field>
  )
}

// Standalone UserSelectField component (without Formik)
export function StandaloneUserSelectField({
  name,
  label,
  placeholder = 'Select users...',
  required = false,
  disabled = false,
  error,
  helperText,
  className,
  id,
  multiple = false,
  noOptionsMessage = 'No users found',
  searchable = true,
  clearable = true,
  maxSelections,
  value,
  onChange,
}: Omit<UserSelectFieldProps, 'name' | 'options' | 'loading' | 'onSearch'> & {
  name?: string
  value?: string | string[]
  onChange?: (value: string | string[]) => void
}) {
  const fieldId = id || name
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')

  // Use TanStack Query to fetch users only when dropdown is open
  const standaloneUsersOptions: { enabled: boolean; searchQuery?: string } = {
    enabled: open, // Only fetch when dropdown is open
  }

  const standaloneTrimmedQuery = searchQuery.trim()
  if (standaloneTrimmedQuery) {
    standaloneUsersOptions.searchQuery = standaloneTrimmedQuery
  }

  const { userOptions, isLoading } = useUsers(standaloneUsersOptions)

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return userOptions
    return userOptions.filter(
      (option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [userOptions, searchQuery])

  const selectedValues = Array.isArray(value) ? value : value ? [value] : []
  const selectedOptions = userOptions.filter((option) => selectedValues.includes(option.value))

  const handleSelect = (optionValue: string) => {
    if (!onChange) return

    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : maxSelections && selectedValues.length >= maxSelections
          ? selectedValues
          : [...selectedValues, optionValue]

      onChange(newValues)
    } else {
      onChange(optionValue)
      setOpen(false)
    }
  }

  const handleRemove = (optionValue: string) => {
    if (!onChange) return

    if (multiple) {
      const newValues = selectedValues.filter((v) => v !== optionValue)
      onChange(newValues)
    } else {
      onChange('')
    }
  }

  const handleClear = () => {
    if (!onChange) return
    onChange(multiple ? [] : '')
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
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
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'h-auto min-h-10 w-full justify-between',
              error && 'border-destructive focus:border-destructive focus-visible:ring-destructive'
            )}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error || helperText ? `${fieldId}-description` : undefined}
          >
            <div className="flex flex-1 flex-wrap gap-1">
              {selectedOptions.length > 0 ? (
                selectedOptions.map((option) => (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={option.avatar || undefined} />
                      <AvatarFallback className="text-xs">
                        {option.label
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{option.label}</span>
                    {!disabled && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-3 w-3 p-0 hover:bg-transparent"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleRemove(option.value)
                        }}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    )}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground text-sm">{placeholder}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {clearable && selectedOptions.length > 0 && !disabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleClear()
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            {searchable && (
              <CommandInput
                placeholder="Search users..."
                value={searchQuery}
                onValueChange={handleSearchChange}
              />
            )}
            <CommandList>
              <CommandEmpty>{isLoading ? 'Loading...' : noOptionsMessage}</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => {
                  const isSelected = selectedValues.includes(option.value)
                  const isDisabled =
                    option.disabled ||
                    (maxSelections && !isSelected && selectedValues.length >= maxSelections)

                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => !isDisabled && handleSelect(option.value)}
                      {...(isDisabled && { disabled: true })}
                      className="flex items-center gap-2"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={option.avatar || undefined} />
                        <AvatarFallback className="text-xs">
                          {option.label
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-muted-foreground text-xs">{option.email}</div>
                        {option.department && (
                          <div className="text-muted-foreground text-xs">{option.department}</div>
                        )}
                      </div>
                      {isSelected && <Check className="h-4 w-4" />}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FormFieldWrapper>
  )
}

export default UserSelectField
