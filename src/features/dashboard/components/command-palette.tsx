'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Search,
  Home,
  BarChart3,
  Users,
  Settings,
  FileText,
  Calendar,
  MessageSquare,
  FolderOpen,
  Folder,
  Command,
} from 'lucide-react'

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
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Go to main dashboard',
    href: '/dashboard',
    icon: Home,
    category: 'Navigation',
    keywords: ['dashboard', 'home', 'main'],
  },
  {
    id: 'analytics',
    title: 'Analytics Overview',
    description: 'View analytics and metrics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    category: 'Analytics',
    keywords: ['analytics', 'metrics', 'stats', 'data'],
  },
  {
    id: 'reports',
    title: 'Reports',
    description: 'Generate and view reports',
    href: '/dashboard/analytics/reports',
    icon: FileText,
    category: 'Analytics',
    keywords: ['reports', 'export', 'data'],
  },
  {
    id: 'insights',
    title: 'Insights',
    description: 'View data insights',
    href: '/dashboard/analytics/insights',
    icon: MessageSquare,
    category: 'Analytics',
    keywords: ['insights', 'analysis', 'trends'],
  },
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
    id: 'archived-projects',
    title: 'Archived Projects',
    description: 'View archived projects',
    href: '/dashboard/projects/archived',
    icon: Folder,
    category: 'Projects',
    keywords: ['archived', 'projects', 'old'],
  },
  {
    id: 'tasks',
    title: 'Tasks',
    description: 'Manage your tasks',
    href: '/dashboard/tasks',
    icon: Calendar,
    category: 'Tasks',
    keywords: ['tasks', 'todo', 'work', 'schedule'],
  },
  {
    id: 'team-members',
    title: 'Team Members',
    description: 'Manage team members',
    href: '/dashboard/team/members',
    icon: Users,
    category: 'Team',
    keywords: ['team', 'members', 'people', 'users'],
  },
  {
    id: 'team-roles',
    title: 'Team Roles',
    description: 'Manage team roles and permissions',
    href: '/dashboard/team/roles',
    icon: Settings,
    category: 'Team',
    keywords: ['roles', 'permissions', 'access'],
  },
  {
    id: 'documents',
    title: 'All Documents',
    description: 'Access all documents',
    href: '/dashboard/documents',
    icon: FileText,
    category: 'Documents',
    keywords: ['documents', 'files', 'papers'],
  },
  {
    id: 'shared-documents',
    title: 'Shared Documents',
    description: 'View shared documents',
    href: '/dashboard/documents/shared',
    icon: FileText,
    category: 'Documents',
    keywords: ['shared', 'documents', 'collaboration'],
  },
  {
    id: 'recent-documents',
    title: 'Recent Documents',
    description: 'View recently accessed documents',
    href: '/dashboard/documents/recent',
    icon: FileText,
    category: 'Documents',
    keywords: ['recent', 'documents', 'latest'],
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Configure your account',
    href: '/dashboard/settings',
    icon: Settings,
    category: 'Settings',
    keywords: ['settings', 'config', 'preferences'],
  },
]

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()

  const filteredCommands = commands.filter((command) => {
    const searchLower = search.toLowerCase()
    return (
      command.title.toLowerCase().includes(searchLower) ||
      command.description?.toLowerCase().includes(searchLower) ||
      command.keywords.some((keyword) => keyword.toLowerCase().includes(searchLower))
    )
  })

  const groupedCommands = filteredCommands.reduce(
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
      setSearch('')
      setSelectedIndex(0)
    },
    [router, onClose]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredCommands[selectedIndex]) {
          handleSelect(filteredCommands[selectedIndex])
        }
      }
    },
    [filteredCommands, selectedIndex, handleSelect]
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  useEffect(() => {
    if (isOpen) {
      setSearch('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0" role="dialog" aria-label="Command palette">
        <DialogHeader className="sr-only">
          <DialogTitle>Command Palette</DialogTitle>
        </DialogHeader>

        <div className="flex items-center border-b px-4 py-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
            role="combobox"
            aria-expanded={true}
            aria-autocomplete="list"
            aria-activedescendant={filteredCommands[selectedIndex]?.id}
          />
          <div className="ml-auto flex items-center space-x-1">
            <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
              <span className="text-xs">ESC</span>
            </kbd>
          </div>
        </div>

        <ScrollArea className="max-h-96">
          {Object.keys(groupedCommands).length === 0 ? (
            <div className="text-muted-foreground py-6 text-center text-sm">No results found.</div>
          ) : (
            <div className="p-2">
              {Object.entries(groupedCommands).map(([category, items]) => (
                <div key={category} className="mb-4 last:mb-0">
                  <div className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
                    {category}
                  </div>
                  <div className="space-y-1">
                    {items.map((command, index) => {
                      const globalIndex = filteredCommands.indexOf(command)
                      return (
                        <Button
                          key={command.id}
                          variant="ghost"
                          className={cn(
                            'h-auto w-full justify-start p-2 text-left transition-colors duration-150',
                            globalIndex === selectedIndex && 'bg-accent text-accent-foreground'
                          )}
                          onClick={() => handleSelect(command)}
                          id={command.id}
                          role="option"
                          aria-selected={globalIndex === selectedIndex}
                        >
                          <command.icon className="mr-2 h-4 w-4 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium">{command.title}</div>
                            {command.description && (
                              <div className="text-muted-foreground text-xs">
                                {command.description}
                              </div>
                            )}
                          </div>
                        </Button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
