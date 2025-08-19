'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardHeading,
  CardTitle,
  CardToolbar,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Grid3X3, List, Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useProjects } from '../context'
import type { ProjectsPageProps, Project } from '../types'
import { PROJECT_PRIORITY, PROJECT_STATUS } from '../types'
import { CreateProjectModal, ProjectCard } from '../components'

export default function ProjectsPage({ className }: ProjectsPageProps) {
  const {
    projects,
    loading,
    error,
    filters,
    sortOptions,
    pagination,
    setFilters,
    setSortOptions,
    setPage,
    clearError,
    refreshProjects,
  } = useProjects()

  // Local state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState(filters.search || '')

  // Handle search input change with debouncing
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    // Debounce search
    const timeoutId = setTimeout(() => {
      if (value.trim()) {
        setFilters({ search: value.trim() })
      } else {
        setFilters({ search: undefined })
      }
    }, 300)
    return () => clearTimeout(timeoutId)
  }

  // Handle filter changes
  const handleStatusFilter = (status: string) => {
    const currentStatuses = filters.status || []
    const newStatuses = currentStatuses.includes(status as any)
      ? currentStatuses.filter((s) => s !== status)
      : [...currentStatuses, status as any]

    setFilters({ status: newStatuses.length > 0 ? newStatuses : undefined })
  }

  const handlePriorityFilter = (priority: string) => {
    const currentPriorities = filters.priority || []
    const newPriorities = currentPriorities.includes(priority as any)
      ? currentPriorities.filter((p) => p !== priority)
      : [...currentPriorities, priority as any]

    setFilters({ priority: newPriorities.length > 0 ? newPriorities : undefined })
  }

  // Handle sort changes
  const handleSortChange = (field: string) => {
    const newDirection =
      sortOptions.field === field && sortOptions.direction === 'asc' ? 'desc' : 'asc'
    setSortOptions({ field: field as any, direction: newDirection })
  }

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('')
    setFilters({})
  }

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.search ||
      (filters.status && filters.status.length > 0) ||
      (filters.priority && filters.priority.length > 0)
    )
  }, [filters])

  // Handle project creation success
  const handleProjectCreated = () => {
    setIsCreateModalOpen(false)
    refreshProjects()
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

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage and track your projects</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Project
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            {error}
            <Button variant="outline" size="sm" onClick={clearError}>
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Search and Filters */}
      <Card variant="accent">
        <CardHeader className="py-2">
          <CardHeading>
            <CardTitle className="text-lg">Search & Filters</CardTitle>
            <CardDescription>Find and filter your projects</CardDescription>
          </CardHeading>
          <CardToolbar>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </CardToolbar>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Projects</Label>
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                id="search"
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-6">
            {/* Status Filter */}
            <div className="space-y-3">
              <Label>Status</Label>
              <div className="flex flex-wrap gap-2">
                {Object.values(PROJECT_STATUS).map((status) => (
                  <Badge
                    key={status}
                    variant={
                      filters.status?.includes(status) ? getStatusVariant(status) : 'outline'
                    }
                    className="cursor-pointer"
                    onClick={() => handleStatusFilter(status)}
                  >
                    {status.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div className="space-y-3">
              <Label>Priority</Label>
              <div className="flex flex-wrap gap-2">
                {Object.values(PROJECT_PRIORITY).map((priority) => (
                  <Badge
                    key={priority}
                    variant={
                      filters.priority?.includes(priority)
                        ? getPriorityVariant(priority)
                        : 'outline'
                    }
                    className="cursor-pointer"
                    onClick={() => handlePriorityFilter(priority)}
                  >
                    {priority}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Active Filters & Clear */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between border-t pt-2">
              <span className="text-muted-foreground text-sm">
                {projects.length} project{projects.length !== 1 ? 's' : ''} found
              </span>
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projects Grid/List */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse py-2" variant="accent">
              <CardHeader>
                <div className="bg-muted h-4 w-3/4 rounded"></div>
                <div className="bg-muted h-3 w-1/2 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="bg-muted h-3 rounded"></div>
                  <div className="bg-muted h-3 w-2/3 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card variant="accent">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="space-y-4 text-center">
              <div className="bg-muted mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                <Plus className="text-muted-foreground h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium">No projects found</h3>
                <p className="text-muted-foreground">
                  {hasActiveFilters
                    ? 'Try adjusting your filters or search terms'
                    : 'Get started by creating your first project'}
                </p>
              </div>
              {!hasActiveFilters && (
                <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Project
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div
          className={viewMode === 'grid' ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              viewMode={viewMode}
              onEdit={(project: Project) => {
                // TODO: Implement edit functionality
                console.log('Edit project:', project)
              }}
              onDelete={(projectId: string) => {
                // TODO: Implement delete functionality
                console.log('Delete project:', projectId)
              }}
              onView={(projectId: string) => {
                // TODO: Implement view functionality
                console.log('View project:', projectId)
              }}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}{' '}
            projects
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(pagination.page + 1)}
              disabled={!pagination.hasMore}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleProjectCreated}
      />
    </div>
  )
}
