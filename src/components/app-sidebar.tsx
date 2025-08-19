'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Home,
  BarChart3,
  Users,
  Settings,
  FileText,
  Calendar,
  FolderOpen,
  Database,
  HelpCircle,
  Search,
} from 'lucide-react'

import { NavDocuments } from '@/components/nav-documents'
import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
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

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: Home,
    },
    {
      title: 'Analytics',
      url: '/dashboard/analytics',
      icon: BarChart3,
    },
    {
      title: 'Projects',
      url: '/dashboard/projects',
      icon: FolderOpen,
    },
    {
      title: 'Tasks',
      url: '/dashboard/tasks',
      icon: Calendar,
    },
    {
      title: 'Team',
      url: '/dashboard/team',
      icon: Users,
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
  documents: [
    {
      name: 'Data Library',
      url: '/dashboard/data',
      icon: Database,
    },
    {
      name: 'Reports',
      url: '/dashboard/reports',
      icon: BarChart3,
    },
    {
      name: 'Documents',
      url: '/dashboard/documents',
      icon: FileText,
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <span className="text-sm font-bold">P</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Pegasus</span>
                  <span className="truncate text-xs">Task Manager</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
