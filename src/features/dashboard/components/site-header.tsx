'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { CommandPaletteTrigger } from './command-palette-trigger'

export function SiteHeader() {
    const pathname = usePathname()

    // Generate breadcrumb items based on current path
    const pathSegments = pathname.split('/').filter(Boolean)
    const breadcrumbItems = pathSegments.map((segment, index) => {
        const href = '/' + pathSegments.slice(0, index + 1).join('/')
        const isLast = index === pathSegments.length - 1
        const title = segment.charAt(0).toUpperCase() + segment.slice(1)

        return {
            title,
            href,
            isLast,
        }
    })
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbItems.map((item, index) => (
                            <div key={item.href} className="flex items-center">
                                {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                                <BreadcrumbItem className={index === 0 ? 'hidden md:block' : ''}>
                                    {item.isLast ? (
                                        <BreadcrumbPage>{item.title}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink asChild>
                                            <Link href={item.href}>{item.title}</Link>
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                            </div>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Command Palette */}
            <div className="ml-auto flex items-center gap-2 px-4">
                <div className="hidden md:flex">
                    <CommandPaletteTrigger />
                </div>
            </div>
        </header>
    )
}
