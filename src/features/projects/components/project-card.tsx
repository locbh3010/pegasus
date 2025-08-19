'use client'

import { useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardHeading,
  CardToolbar,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Calendar, Clock, MoreHorizontal, Trash2, Eye, AlertCircle } from 'lucide-react'
import type { ProjectCardProps } from '../types'

export function ProjectCard({
  project,
  viewMode = 'grid',
  onDelete,
  onView,
  className,
}: ProjectCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Format dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    try {
      return dayjs(dateString).fromNow()
    } catch {
      return null
    }
  }

  // Status badge variant mapping
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'primary'
      case 'completed':
        return 'success'
      case 'on_hold':
        return 'warning'
      case 'cancelled':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  // Priority badge variant mapping
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive'
      case 'high':
        return 'warning'
      case 'medium':
        return 'primary'
      case 'low':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  // Handle actions

  const handleDelete = () => {
    setIsMenuOpen(false)
    onDelete?.(project.id)
  }

  const handleView = () => {
    setIsMenuOpen(false)
    onView?.(project.id)
  }

  if (viewMode === 'list') {
    return (
      <Card className={`transition-shadow hover:shadow-md ${className || ''}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-semibold">{project.name}</h3>
                  {project.description && (
                    <p className="text-muted-foreground mt-1 line-clamp-1 text-sm">
                      {project.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusVariant(project.status)} size="sm">
                    {project.status.replace('_', ' ')}
                  </Badge>
                  <Badge variant={getPriorityVariant(project.priority)} size="sm">
                    {project.priority}
                  </Badge>
                </div>
              </div>

              <div className="text-muted-foreground mt-3 flex items-center gap-4 text-sm">
                {project.start_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Started {formatDate(project.start_date)}</span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Updated {formatDate(project.updated_at || project.created_at || '')}</span>
                </div>
              </div>
            </div>

            <div className="ml-4 flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleView}>
                <Eye className="h-4 w-4" />
                View
              </Button>

              <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Grid view
  return (
    <Card className={`transition-shadow hover:shadow-md ${className || ''}`} variant="accent">
      <CardHeader className="py-2">
        <CardHeading>
          <CardTitle className="line-clamp-1" title={project.name}>
            {project.name}
          </CardTitle>
          {project.description && (
            <CardDescription className="line-clamp-2" title={project.description}>
              {project.description}
            </CardDescription>
          )}
        </CardHeading>
        <CardToolbar>
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleView}>
                <Eye className="mr-2 h-4 w-4" />
                View Project
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardToolbar>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status and Priority Badges */}
        <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant(project.status)} size="sm">
            {project.status.replace('_', ' ')}
          </Badge>
          <Badge variant={getPriorityVariant(project.priority)} size="sm">
            {project.priority}
          </Badge>
        </div>

        {/* Project Details */}
        <div className="space-y-2 text-sm">
          {project.start_date && (
            <div className="text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Started {formatDate(project.start_date)}</span>
            </div>
          )}

          {project.end_date && (
            <div className="text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>Due {formatDate(project.end_date)}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="justify-between">
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <Clock className="h-3 w-3" />
          <span>Updated {formatDate(project.updated_at || project.created_at || '')}</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleView}>
          <Eye className="h-4 w-4" />
          View
        </Button>
      </CardFooter>
    </Card>
  )
}
