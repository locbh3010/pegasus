'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Home, BarChart3, Users, Settings, Calendar, FolderOpen, Folder } from 'lucide-react'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

interface CommandItem {
  id: string
  title: string
  description?: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  category: string
  keywords: string[]
}

const commands: CommandItem[] = [
  // Pages
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Go to main dashboard',
    href: '/dashboard',
    icon: Home,
    category: 'Pages',
    keywords: ['dashboard', 'home', 'main'],
  },
  {
    id: 'analytics',
    title: 'Analytics Overview',
    description: 'View analytics and metrics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    category: 'Pages',
    keywords: ['analytics', 'metrics', 'stats', 'data'],
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Configure your account',
    href: '/dashboard/settings',
    icon: Settings,
    category: 'Pages',
    keywords: ['settings', 'config', 'preferences'],
  },

  // Projects
  {
    id: 'projects',
    title: 'All Projects',
    description: 'Manage your projects',
    href: '/dashboard/projects',
    icon: FolderOpen,
    category: 'Projects',
    keywords: ['projects', 'work', 'manage'],
  },
  {
    id: 'active-projects',
    title: 'Active Projects',
    description: 'View active projects',
    href: '/dashboard/projects/active',
    icon: FolderOpen,
    category: 'Projects',
    keywords: ['active', 'projects', 'current'],
  },
  {
    id: 'completed-projects',
    title: 'Completed Projects',
    description: 'View completed projects',
    href: '/dashboard/projects/completed',
    icon: Folder,
    category: 'Projects',
    keywords: ['completed', 'projects', 'finished'],
  },
  {
    id: 'archived-projects',
    title: 'Archived Projects',
    description: 'View archived projects',
    href: '/dashboard/projects/archived',
    icon: Folder,
    category: 'Projects',
    keywords: ['archived', 'projects', 'old'],
  },

  // Tasks
  {
    id: 'tasks',
    title: 'All Tasks',
    description: 'Manage your tasks',
    href: '/dashboard/tasks',
    icon: Calendar,
    category: 'Tasks',
    keywords: ['tasks', 'todo', 'work', 'schedule'],
  },
  {
    id: 'my-tasks',
    title: 'My Tasks',
    description: 'View tasks assigned to you',
    href: '/dashboard/tasks/my',
    icon: Calendar,
    category: 'Tasks',
    keywords: ['my', 'tasks', 'assigned'],
  },
  {
    id: 'overdue-tasks',
    title: 'Overdue Tasks',
    description: 'View overdue tasks',
    href: '/dashboard/tasks/overdue',
    icon: Calendar,
    category: 'Tasks',
    keywords: ['overdue', 'tasks', 'late'],
  },
  {
    id: 'completed-tasks',
    title: 'Completed Tasks',
    description: 'View completed tasks',
    href: '/dashboard/tasks/completed',
    icon: Calendar,
    category: 'Tasks',
    keywords: ['completed', 'tasks', 'done'],
  },

  // Accounts
  {
    id: 'team-members',
    title: 'Team Members',
    description: 'Manage team members',
    href: '/dashboard/team/members',
    icon: Users,
    category: 'Accounts',
    keywords: ['team', 'members', 'people', 'users'],
  },
  {
    id: 'user-roles',
    title: 'User Roles',
    description: 'Manage user roles and permissions',
    href: '/dashboard/team/roles',
    icon: Settings,
    category: 'Accounts',
    keywords: ['roles', 'permissions', 'access'],
  },
  {
    id: 'user-profile',
    title: 'User Profile',
    description: 'View and edit your profile',
    href: '/dashboard/profile',
    icon: Users,
    category: 'Accounts',
    keywords: ['profile', 'user', 'account'],
  },
  {
    id: 'account-settings',
    title: 'Account Settings',
    description: 'Manage account settings',
    href: '/dashboard/account',
    icon: Settings,
    category: 'Accounts',
    keywords: ['account', 'settings', 'preferences'],
  },
]

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter()

  const groupedCommands = commands.reduce(
    (acc, command) => {
      if (!acc[command.category]) {
        acc[command.category] = []
      }
      acc[command.category].push(command)
      return acc
    },
    {} as Record<string, CommandItem[]>
  )

  const handleSelect = useCallback(
    (command: CommandItem) => {
      router.push(command.href)
      onClose()
    },
    [router, onClose]
  )

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList className="max-h-[480px]">
        <CommandEmpty>No results found.</CommandEmpty>
        {Object.entries(groupedCommands).map(([category, items]) => (
          <CommandGroup key={category} heading={category}>
            {items.map((command) => (
              <CommandItem
                key={command.id}
                value={`${command.title} ${command.description} ${command.keywords.join(' ')}`}
                onSelect={() => handleSelect(command)}
              >
                <command.icon className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span>{command.title}</span>
                  {command.description && (
                    <span className="text-muted-foreground text-xs">{command.description}</span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
