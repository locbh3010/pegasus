import * as React from 'react'
import { cn } from '@/lib/utils'
import { getAutofillPreventionAttributes } from '@/utils/autofill-prevention'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, ...props }, ref) => {
        const autofillAttrs = getAutofillPreventionAttributes()

        return (
            <input
                type={type}
                {...autofillAttrs}
                className={cn(
                    'border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                    error && 'border-destructive focus-visible:ring-destructive',
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = 'Input'

export { Input }
