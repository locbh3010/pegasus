'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  Home,
  Plus,
  Settings,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CheckSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { SidebarProps } from '@/types'

// Mock projects data - this will be replaced with real data later
const mockProjects = [
  { id: '1', name: 'Personal Tasks', color: '#3b82f6', memberCount: 1 },
  { id: '2', name: 'Work Project', color: '#10b981', memberCount: 5 },
  { id: '3', name: 'Side Project', color: '#f59e0b', memberCount: 2 },
]

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { data: session } = useSession()
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (!session) {
    return null
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`bg-card border-border fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] border-r transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        } hidden lg:block`}
      >
        <div className="flex h-full flex-col">
          {/* Collapse Toggle */}
          <div className="flex justify-end p-2">
            <Button variant="ghost" size="sm" onClick={toggleCollapse} className="h-8 w-8 p-0">
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          <ScrollArea className="flex-1 px-3">
            {/* Navigation Items */}
            <div className="space-y-2">
              <Button
                variant="ghost"
                className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-3'}`}
              >
                <Home className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">Dashboard</span>}
              </Button>

              <Button
                variant="ghost"
                className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-3'}`}
              >
                <CheckSquare className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">My Tasks</span>}
              </Button>

              <Button
                variant="ghost"
                className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-3'}`}
              >
                <Calendar className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">Calendar</span>}
              </Button>
            </div>

            {!isCollapsed && (
              <>
                <Separator className="my-4" />

                {/* Projects Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-3">
                    <h3 className="text-muted-foreground text-sm font-medium">Projects</h3>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="space-y-1">
                    {mockProjects.map((project) => (
                      <Button
                        key={project.id}
                        variant="ghost"
                        className="h-8 w-full justify-start px-3"
                      >
                        <div
                          className="mr-2 h-3 w-3 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="truncate text-sm">{project.name}</span>
                        <span className="text-muted-foreground ml-auto text-xs">
                          {project.memberCount}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </ScrollArea>

          {/* Bottom Section */}
          <div className="border-border border-t p-3">
            <Button
              variant="ghost"
              className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-3'}`}
            >
              <Settings className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">Settings</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`bg-card border-border fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-64 border-r transition-transform duration-300 lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <ScrollArea className="flex-1 px-3 py-4">
            {/* Navigation Items */}
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start px-3" onClick={onClose}>
                <Home className="h-4 w-4" />
                <span className="ml-2">Dashboard</span>
              </Button>

              <Button variant="ghost" className="w-full justify-start px-3" onClick={onClose}>
                <CheckSquare className="h-4 w-4" />
                <span className="ml-2">My Tasks</span>
              </Button>

              <Button variant="ghost" className="w-full justify-start px-3" onClick={onClose}>
                <Calendar className="h-4 w-4" />
                <span className="ml-2">Calendar</span>
              </Button>
            </div>

            <Separator className="my-4" />

            {/* Projects Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-3">
                <h3 className="text-muted-foreground text-sm font-medium">Projects</h3>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <div className="space-y-1">
                {mockProjects.map((project) => (
                  <Button
                    key={project.id}
                    variant="ghost"
                    className="h-8 w-full justify-start px-3"
                    onClick={onClose}
                  >
                    <div
                      className="mr-2 h-3 w-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="truncate text-sm">{project.name}</span>
                    <span className="text-muted-foreground ml-auto text-xs">
                      {project.memberCount}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </ScrollArea>

          {/* Bottom Section */}
          <div className="border-border border-t p-3">
            <Button variant="ghost" className="w-full justify-start px-3" onClick={onClose}>
              <Settings className="h-4 w-4" />
              <span className="ml-2">Settings</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
