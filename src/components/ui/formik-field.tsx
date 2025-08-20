import React from 'react'
import { Field, FieldProps } from 'formik'
import { getAutofillPreventionAttributes } from '@/utils/autofill-prevention'
import { cn } from '@/lib/utils'

interface FormikFieldProps {
    id: string
    name: string
    type?: string
    placeholder?: string
    className?: string
    disabled?: boolean
}

export function FormikField({
    id,
    name,
    type = 'text',
    placeholder,
    className,
    disabled = false,
    ...props
}: FormikFieldProps) {
    const autofillAttrs = getAutofillPreventionAttributes()

    return (
        <Field name={name}>
            {({ field, meta }: FieldProps) => (
                <input
                    {...field}
                    {...autofillAttrs}
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={cn(
                        'border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-offset-2 focus:outline-none',
                        meta.touched && meta.error && 'border-destructive focus:ring-destructive',
                        className
                    )}
                    {...props}
                />
            )}
        </Field>
    )
}
