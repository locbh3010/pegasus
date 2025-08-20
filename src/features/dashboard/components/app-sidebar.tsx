'use client'

import { FolderOpen, HelpCircle, Home, Search, Settings } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useAuth } from '@/features/auth/components/auth-provider'
import { DashboardLayoutProvider } from '../context/dashboard-layout-context'
import { NavMain } from './nav-main'
import { NavSecondary } from './nav-secondary'
import { NavUser } from './nav-user'

const data = {
    navMain: [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: Home,
        },
        {
            title: 'Projects',
            url: '/dashboard/projects',
            icon: FolderOpen,
            items: [
                {
                    title: 'All Projects',
                    url: '/dashboard/projects',
                },
                {
                    title: 'Active Projects',
                    url: '/dashboard/projects/active',
                },
                {
                    title: 'Completed Projects',
                    url: '/dashboard/projects/completed',
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: 'Settings',
            url: '/dashboard/settings',
            icon: Settings,
        },
        {
            title: 'Get Help',
            url: '/help',
            icon: HelpCircle,
        },
        {
            title: 'Search',
            url: '/search',
            icon: Search,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user } = useAuth()

    // Get user display information
    const userDisplayName =
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email?.split('@')[0] ||
        'User'

    const userEmail = user?.email || ''

    const userAvatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || ''

    const userData = {
        name: userDisplayName,
        email: userEmail,
        avatar: userAvatarUrl,
    }

    return (
        <DashboardLayoutProvider>
            <Sidebar collapsible="icon" {...props}>
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton className="cursor-pointer" size="lg" asChild>
                                <Link href="/dashboard">
                                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                        <span className="text-sm font-bold">P</span>
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">Pegasus</span>
                                        <span className="truncate text-xs">Project Manager</span>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <ScrollArea className="flex-1">
                        <NavMain items={data.navMain} />
                    </ScrollArea>
                </SidebarContent>
                <SidebarFooter>
                    <NavSecondary items={data.navSecondary} />
                    <NavUser user={userData} />
                </SidebarFooter>
            </Sidebar>
        </DashboardLayoutProvider>
    )
}
