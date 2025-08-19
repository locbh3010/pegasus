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
import type { ProjectsPageProps, Project } from '../types'
import { ProjectPriority, ProjectStatus } from '../constants'
import { CreateProjectModal, ProjectCard } from '../components'

// Mock data for UI showcase
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    description: 'Building a modern e-commerce platform with React and Node.js',
    priority: ProjectPriority.HIGH,
    status: ProjectStatus.ACTIVE,
    start_date: '2024-01-15',
    end_date: '2024-06-30',
    created_by: 'user1',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-20T15:30:00Z',
    budget: 50000,
    client_name: 'TechCorp Inc.',
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Cross-platform mobile app using React Native',
    priority: ProjectPriority.MEDIUM,
    status: ProjectStatus.PLANNING,
    start_date: '2024-03-01',
    end_date: '2024-08-15',
    created_by: 'user1',
    created_at: '2024-01-05T09:00:00Z',
    updated_at: '2024-01-18T11:45:00Z',
    budget: 35000,
    client_name: 'StartupXYZ',
  },
  {
    id: '3',
    name: 'Data Analytics Dashboard',
    description: 'Real-time analytics dashboard for business intelligence',
    priority: ProjectPriority.URGENT,
    status: ProjectStatus.ON_HOLD,
    start_date: '2024-02-01',
    end_date: '2024-05-30',
    created_by: 'user1',
    created_at: '2024-01-08T14:20:00Z',
    updated_at: '2024-01-22T16:10:00Z',
    budget: 75000,
    client_name: 'DataCorp Ltd.',
  },
]

export default function ProjectsPage({ className }: ProjectsPageProps) {
  // UI state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatuses, setSelectedStatuses] = useState<ProjectStatus[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<ProjectPriority[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [loading] = useState(false)
  const [error] = useState<Error | null>(null)

  // Filter projects based on UI state
  const filteredProjects = useMemo(() => {
    return mockProjects.filter((project) => {
      const matchesSearch =
        !searchQuery ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(project.status)

      const matchesPriority =
        selectedPriorities.length === 0 || selectedPriorities.includes(project.priority)

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [searchQuery, selectedStatuses, selectedPriorities])

  // UI handlers
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  const handleStatusFilter = (status: ProjectStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }

  const handlePriorityFilter = (priority: ProjectPriority) => {
    setSelectedPriorities((prev) =>
      prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority]
    )
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedStatuses([])
    setSelectedPriorities([])
  }

  const openCreateModal = () => setIsCreateModalOpen(true)
  const closeCreateModal = () => setIsCreateModalOpen(false)

  const clearError = () => {
    // No-op for UI showcase
  }

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(searchQuery || selectedStatuses.length > 0 || selectedPriorities.length > 0)
  }, [searchQuery, selectedStatuses, selectedPriorities])

  // Status badge variant mapping
  const getStatusVariant = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.ACTIVE:
        return 'primary'
      case ProjectStatus.COMPLETED:
        return 'success'
      case ProjectStatus.ON_HOLD:
        return 'warning'
      case ProjectStatus.CANCELLED:
        return 'destructive'
      case ProjectStatus.PLANNING:
        return 'secondary'
      default:
        return 'outline'
    }
  }

  // Priority badge variant mapping
  const getPriorityVariant = (priority: ProjectPriority) => {
    switch (priority) {
      case ProjectPriority.URGENT:
        return 'destructive'
      case ProjectPriority.HIGH:
        return 'warning'
      case ProjectPriority.MEDIUM:
        return 'primary'
      case ProjectPriority.LOW:
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
        <Button onClick={openCreateModal} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Project
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            {error?.message || 'An error occurred'}
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
              <Search className="text-muted-foreground absolute top-1/2 left-3 mb-3 h-4 w-4 -translate-y-1/2" />
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
                {(Object.values(ProjectStatus) as ProjectStatus[]).map((status) => (
                  <Badge
                    key={status}
                    variant={
                      selectedStatuses.includes(status) ? getStatusVariant(status) : 'outline'
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
                {(Object.values(ProjectPriority) as ProjectPriority[]).map((priority) => (
                  <Badge
                    key={priority}
                    variant={
                      selectedPriorities.includes(priority)
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
                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
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
                <div className="bg-muted h-4 w-3/4 rounded" />
                <div className="bg-muted h-3 w-1/2 rounded" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="bg-muted h-3 rounded" />
                  <div className="bg-muted h-3 w-2/3 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
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
                <Button onClick={openCreateModal} className="gap-2">
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
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              viewMode={viewMode}
              onDelete={(_projectId: string) => {
                // TODO: Implement delete functionality
              }}
              onView={(_projectId: string) => {
                // TODO: Implement view functionality
              }}
            />
          ))}
        </div>
      )}

      {/* Pagination would go here in a real app */}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSuccess={() => {
          // In a real app, this would refresh the data
          closeCreateModal()
        }}
      />
    </div>
  )
}
