'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
    Home,
    BarChart3,
    Users,
    Settings,
    FileText,
    Calendar,
    MessageSquare,
    ChevronDown,
    ChevronRight,
    FolderOpen,
    Folder,
} from 'lucide-react'

interface SidebarProps {
    isCollapsed: boolean
    onToggle: () => void
    className?: string
}

interface NavItem {
    title: string
    href?: string
    icon: React.ComponentType<{ className?: string }>
    children?: NavItem[]
    badge?: string
}

const navigationItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: Home,
    },
    {
        title: 'Analytics',
        icon: BarChart3,
        children: [
            { title: 'Overview', href: '/dashboard/analytics', icon: BarChart3 },
            { title: 'Reports', href: '/dashboard/analytics/reports', icon: FileText },
            { title: 'Insights', href: '/dashboard/analytics/insights', icon: MessageSquare },
        ],
    },
    {
        title: 'Projects',
        icon: FolderOpen,
        children: [
            { title: 'All Projects', href: '/dashboard/projects', icon: Folder },
            { title: 'Active', href: '/dashboard/projects/active', icon: FolderOpen },
            { title: 'Archived', href: '/dashboard/projects/archived', icon: Folder },
        ],
    },

    {
        title: 'Team',
        icon: Users,
        children: [
            { title: 'Members', href: '/dashboard/team/members', icon: Users },
            { title: 'Roles', href: '/dashboard/team/roles', icon: Settings },
        ],
    },
    {
        title: 'Documents',
        icon: FileText,
        children: [
            { title: 'All Documents', href: '/dashboard/documents', icon: FileText },
            { title: 'Shared', href: '/dashboard/documents/shared', icon: FileText },
            { title: 'Recent', href: '/dashboard/documents/recent', icon: FileText },
        ],
    },
    {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
    },
]

export function DashboardSidebar({ isCollapsed, onToggle: _onToggle, className }: SidebarProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [openItems, setOpenItems] = useState<string[]>(['Projects', 'Analytics'])

    const toggleItem = (title: string) => {
        setOpenItems((prev) =>
            prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
        )
    }

    const handleNavigation = (href: string) => {
        router.push(href)
    }

    const isActive = (href: string) => {
        return pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
    }

    const renderNavItem = (item: NavItem, level = 0) => {
        const hasChildren = item.children && item.children.length > 0
        const isItemOpen = openItems.includes(item.title)
        const isItemActive = item.href ? isActive(item.href) : false

        if (hasChildren) {
            return (
                <Collapsible
                    key={item.title}
                    open={isItemOpen}
                    onOpenChange={() => toggleItem(item.title)}
                >
                    <CollapsibleTrigger asChild>
                        <Button
                            variant="ghost"
                            className={cn(
                                'h-9 w-full justify-start px-3 transition-all duration-200',
                                level > 0 && 'ml-4 w-[calc(100%-1rem)]',
                                isCollapsed && 'justify-center px-2',
                                'hover:bg-accent hover:text-accent-foreground'
                            )}
                            aria-expanded={isItemOpen}
                            aria-label={`${item.title} menu`}
                        >
                            <item.icon className={cn('h-4 w-4', isCollapsed ? '' : 'mr-2')} />
                            {!isCollapsed && (
                                <>
                                    <span className="flex-1 text-left">{item.title}</span>
                                    {item.badge && (
                                        <span className="bg-primary text-primary-foreground ml-auto rounded-full px-2 py-0.5 text-xs">
                                            {item.badge}
                                        </span>
                                    )}
                                    {isItemOpen ? (
                                        <ChevronDown className="ml-1 h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    )}
                                </>
                            )}
                        </Button>
                    </CollapsibleTrigger>
                    {!isCollapsed && (
                        <CollapsibleContent className="space-y-1 transition-all duration-200 ease-in-out">
                            <div className="ml-4 space-y-1">
                                {item.children?.map((child) => renderNavItem(child, level + 1))}
                            </div>
                        </CollapsibleContent>
                    )}
                </Collapsible>
            )
        }

        return (
            <Button
                key={item.title}
                variant="ghost"
                className={cn(
                    'h-9 w-full justify-start px-3 transition-all duration-200',
                    level > 0 && 'ml-4 w-[calc(100%-1rem)]',
                    isCollapsed && 'justify-center px-2',
                    isItemActive
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                )}
                onClick={() => item.href && handleNavigation(item.href)}
                aria-label={`Navigate to ${item.title}`}
                aria-current={isItemActive ? 'page' : undefined}
            >
                <item.icon className={cn('h-4 w-4', isCollapsed ? '' : 'mr-2')} />
                {!isCollapsed && (
                    <>
                        <span className="flex-1 text-left">{item.title}</span>
                        {item.badge && (
                            <span className="bg-primary text-primary-foreground ml-auto rounded-full px-2 py-0.5 text-xs">
                                {item.badge}
                            </span>
                        )}
                    </>
                )}
            </Button>
        )
    }

    return (
        <div
            className={cn(
                'bg-background flex flex-col border-r transition-all duration-300 ease-in-out',
                'fixed z-40 h-[calc(100vh-4rem)] md:relative md:h-auto',
                isCollapsed ? 'w-16' : 'w-64',
                isCollapsed && 'md:w-16', // Ensure collapsed state on desktop
                !isCollapsed && 'shadow-lg md:shadow-none', // Shadow on mobile when expanded
                className
            )}
            role="navigation"
            aria-label="Main navigation"
        >
            {/* Sidebar Header */}
            <div className="border-b p-4">
                {!isCollapsed && (
                    <div className="flex items-center space-x-2">
                        <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                            <span className="text-primary-foreground text-sm font-bold">P</span>
                        </div>
                        <span className="text-lg font-semibold">Pegasus</span>
                    </div>
                )}
                {isCollapsed && (
                    <div className="flex justify-center">
                        <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                            <span className="text-primary-foreground text-sm font-bold">P</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 px-3 py-4">
                <nav className="space-y-1">
                    {navigationItems.map((item) => renderNavItem(item))}
                </nav>
            </ScrollArea>
        </div>
    )
}
