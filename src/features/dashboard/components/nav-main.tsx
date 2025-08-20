'use client'

import { useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type LucideIcon, ChevronRight } from 'lucide-react'
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useDashboardLayout } from '../context/dashboard-layout-context'

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon?: LucideIcon
        isActive?: boolean
        items?: { title: string; url: string }[]
        badge?: string
    }[]
}) {
    const pathname = usePathname()
    const { state } = useSidebar()
    const {
        projectsExpanded,
        toggleProjects,
        setProjectsExpanded,
        userManuallyCollapsed,
        resetManualCollapse,
    } = useDashboardLayout()

    const isCollapsed = state === 'collapsed'

    // Check if any child route is active to auto-expand parent
    const isAnyChildActive = useCallback(
        (parentItem: (typeof items)[0]) => {
            if (!parentItem.items) {
                return false
            }
            return parentItem.items.some((child) => pathname === child.url)
        },
        [pathname]
    )

    // Auto-expand Projects if we're on a project child route (only when sidebar is expanded and user hasn't manually collapsed)
    useEffect(() => {
        const projectsItem = items.find((item) => item.title === 'Projects')
        const hasActiveChild = projectsItem && isAnyChildActive(projectsItem)

        if (!isCollapsed) {
            if (hasActiveChild && !userManuallyCollapsed && !projectsExpanded) {
                setProjectsExpanded(true)
            }
            // Reset manual collapse flag when navigating away from children
            if (!hasActiveChild && userManuallyCollapsed) {
                resetManualCollapse()
            }
        }
    }, [
        pathname,
        items,
        projectsExpanded,
        setProjectsExpanded,
        isCollapsed,
        userManuallyCollapsed,
        resetManualCollapse,
        isAnyChildActive,
    ])

    return (
        <SidebarGroup>
            {!isCollapsed && <SidebarGroupLabel>Platform</SidebarGroupLabel>}
            <SidebarMenu>
                {items.map((item) => {
                    // Fix route matching - only exact match for items with children
                    const isActive = item.items
                        ? pathname === item.url
                        : pathname === item.url ||
                          (item.url !== '/dashboard' && pathname.startsWith(item.url))
                    const hasActiveChild = isAnyChildActive(item)
                    const isParentActive = hasActiveChild // Only show parent as active if child is active

                    if (item.items && !isCollapsed) {
                        return (
                            <Collapsible
                                key={item.title}
                                asChild
                                open={item.title === 'Projects' ? projectsExpanded : false}
                                onOpenChange={item.title === 'Projects' ? toggleProjects : () => {}}
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            className="cursor-pointer"
                                            tooltip={item.title}
                                            isActive={isParentActive}
                                        >
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            {item.badge && (
                                                <span className="bg-sidebar-primary text-sidebar-primary-foreground ml-auto rounded-full px-2 py-0.5 text-xs">
                                                    {item.badge}
                                                </span>
                                            )}
                                            <ChevronRight
                                                className={`ml-auto transition-transform duration-200 ${projectsExpanded && item.title === 'Projects' ? 'rotate-90' : ''}`}
                                            />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map((subItem) => {
                                                // Fix: Exact match for children to avoid false positives
                                                const isSubItemActive = pathname === subItem.url
                                                return (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton
                                                            className="cursor-pointer"
                                                            asChild
                                                            isActive={isSubItemActive}
                                                        >
                                                            <Link href={subItem.url}>
                                                                <span>{subItem.title}</span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                )
                                            })}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        )
                    }

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                tooltip={item.title}
                                asChild
                                isActive={isActive}
                                className={isCollapsed ? 'justify-center' : 'cursor-pointer'}
                            >
                                <Link href={item.url}>
                                    {item.icon && <item.icon />}
                                    {!isCollapsed && <span>{item.title}</span>}
                                    {!isCollapsed && item.badge && (
                                        <span className="bg-sidebar-primary text-sidebar-primary-foreground ml-auto rounded-full px-2 py-0.5 text-xs">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
