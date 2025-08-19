import { cn } from '@/lib/utils'
import { useDebouncedValue, useShallowEffect } from '@mantine/hooks'
import { useState } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { DebounceInputProps } from './types'

export default function DebounceInput({
  className,
  label,
  placeholder,
  required,
  readonly,
  disabled,
  error,
  helperText,
  debounce = 250,
  value,
  onChange,
  onDebounce,
  id,
}: DebounceInputProps) {
  const [inputValue, setInputValue] = useState(value)
  const [debounced] = useDebouncedValue(inputValue, debounce)

  useShallowEffect(() => {
    onDebounce?.(debounced ?? '')
  }, [debounced])

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={id} className="text-foreground mb-2 block text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <div className="relative">
        <Input
          disabled={disabled}
          readOnly={readonly}
          required={required}
          error={!!error}
          id={id}
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            onChange?.(e.target.value)
          }}
          className={cn(className)}
        />
      </div>
      {error && (
        <p className="text-destructive text-sm" role="alert" aria-live="polite">
          {error}
        </p>
      )}
      {helperText && !error && <p className="text-muted-foreground text-sm">{helperText}</p>}
    </div>
  )
}
