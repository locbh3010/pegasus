'use client'

import DebounceInput from '@/components/form/debounce-input'
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
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useQueryParams } from '@/hooks/use-query-params'
import { useDisclosure } from '@mantine/hooks'
import { AlertCircle, Plus } from 'lucide-react'
import { useState } from 'react'
import { CreateProjectModal, ProjectCard } from '../components'
import { ProjectPriority, ProjectStatus } from '../constants'
import { useProjectsQuery } from '../hooks/use-projects-query'
import type { ProjectsPageProps, ProjectsQueryParams } from '../types'

export default function ProjectsPage({ className }: ProjectsPageProps) {
  const { params, setParams, resetParams, hasFilters } = useQueryParams<ProjectsQueryParams>({
    page: 1,
    limit: 10,
  })
  console.log('🚀 ~ ProjectsPage ~ params:', params)

  const { data, isPending, isError, error } = useProjectsQuery(params)

  const [isCreateModalOpen, createModalHandlers] = useDisclosure(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage and track your projects</p>
        </div>
        <Button onClick={createModalHandlers.open} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Project
        </Button>
      </div>

      {/* Error Alert */}
      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            {error?.message || 'An error occurred'}
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
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Input */}
          <DebounceInput
            id="search"
            label="Search Projects"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(value) => setSearchQuery(value)}
            onDebounce={(search) => {
              setParams({ search, page: 1 })
            }}
          />

          {/* Filters Row */}
          <div className="flex flex-wrap gap-6">
            {/* Status Filter */}
            <div className="space-y-3">
              <Label>Status</Label>
              <div className="flex flex-wrap gap-2">
                {(Object.values(ProjectStatus) as ProjectStatus[]).map((status) => (
                  <Badge
                    key={status}
                    variant={params?.status?.includes(status) ? 'primary' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setParams({ status: [status], page: 1 })}
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
                    variant={params?.priority?.includes(priority) ? 'primary' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setParams({ priority: [priority], page: 1 })}
                  >
                    {priority}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Active Filters & Clear */}
          {hasFilters() && (
            <div className="flex items-center justify-between border-t pt-2">
              <Button variant="outline" size="sm" onClick={resetParams}>
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projects Grid/List */}
      {isPending ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
      ) : data?.data?.length === 0 ? (
        <Card variant="accent">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="space-y-4 text-center">
              <div className="bg-muted mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                <Plus className="text-muted-foreground h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium">No projects found</h3>
                <p className="text-muted-foreground">
                  {hasFilters()
                    ? 'Try adjusting your filters or search terms'
                    : 'Get started by creating your first project'}
                </p>
              </div>
              {!hasFilters() && (
                <Button onClick={createModalHandlers.open} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Project
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data?.data?.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
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
        onClose={createModalHandlers.close}
        onSuccess={() => {
          // In a real app, this would refresh the data
          createModalHandlers.close()
        }}
      />
    </div>
  )
}
