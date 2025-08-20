import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronRight, MoreHorizontal } from 'lucide-react'
import { Slot as SlotPrimitive } from 'radix-ui'

function Breadcrumb({
    ...props
}: React.ComponentProps<'nav'> & {
    separator?: React.ReactNode
}) {
    return <nav data-slot="breadcrumb" aria-label="breadcrumb" {...props} />
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
    return (
        <ol
            data-slot="breadcrumb-list"
            className={cn(
                'text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words',
                className
            )}
            {...props}
        />
    )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) {
    return (
        <li
            data-slot="breadcrumb-item"
            className={cn('inline-flex items-center gap-1.5', className)}
            {...props}
        />
    )
}

function BreadcrumbLink({
    asChild,
    className,
    ...props
}: React.ComponentProps<'a'> & {
    asChild?: boolean
}) {
    const Comp = asChild ? SlotPrimitive.Slot : 'a'

    return (
        <Comp
            data-slot="breadcrumb-link"
            className={cn('hover:text-foreground transition-colors', className)}
            {...props}
        />
    )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span
            data-slot="breadcrumb-page"
            role="link"
            aria-disabled="true"
            aria-current="page"
            className={cn('text-foreground font-normal', className)}
            {...props}
        />
    )
}

const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<'li'>) => (
    <li
        data-slot="breadcrumb-separator"
        role="presentation"
        aria-hidden="true"
        className={cn('[&>svg]:h-3.5 [&>svg]:w-3.5', className)}
        {...props}
    >
        {children ?? <ChevronRight className="rtl:rotate-180" />}
    </li>
)

const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
    <span
        data-slot="breadcrumb-ellipsis"
        role="presentation"
        aria-hidden="true"
        className={cn('flex h-9 w-9 items-center justify-center', className)}
        {...props}
    >
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">More</span>
    </span>
)

export {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
}
