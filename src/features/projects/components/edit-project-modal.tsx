'use client'

import {
  DateField,
  SelectField,
  TextField,
  TextareaField,
  UserSelectField,
  type SelectOption,
} from '@/components/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, Formik } from 'formik'
import { AlertCircle, CheckCircle, Edit } from 'lucide-react'
import { useState, useMemo } from 'react'
import * as Yup from 'yup'
import { useProjectsContext } from '../context'
import { useProjectMembers } from '../hooks/use-project-members'
import type { EditProjectFormData, EditProjectModalProps, UpdateProjectData } from '../types'
import { PROJECT_PRIORITY, PROJECT_STATUS } from '../types'

// Options for select fields
const priorityOptions: SelectOption[] = Object.values(PROJECT_PRIORITY).map((priority) => ({
  value: priority,
  label: priority.charAt(0).toUpperCase() + priority.slice(1),
}))

const statusOptions: SelectOption[] = Object.values(PROJECT_STATUS).map((status) => ({
  value: status,
  label: status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1),
}))

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string()
    .required('Project name is required')
    .min(2, 'Project name must be at least 2 characters')
    .max(100, 'Project name must be less than 100 characters'),
  description: Yup.string().max(500, 'Description must be less than 500 characters'),
  priority: Yup.string().required('Priority is required').oneOf(Object.values(PROJECT_PRIORITY)),
  status: Yup.string().required('Status is required').oneOf(Object.values(PROJECT_STATUS)),
  start_date: Yup.string(),
  end_date: Yup.string().test(
    'end-date-after-start',
    'End date must be after start date',
    function (value) {
      const { start_date } = this.parent
      if (!value || !start_date) return true
      return new Date(value) > new Date(start_date)
    }
  ),
  assigned_users: Yup.array().of(Yup.string()),
})

export function EditProjectModal({
  isOpen,
  onClose,
  onSuccess,
  project,
  className,
}: EditProjectModalProps) {
  const { updateProject } = useProjectsContext()
  const { members } = useProjectMembers(project.id, {
    enabled: isOpen, // Only fetch when modal is open
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Get current assigned user IDs from project members
  const currentAssignedUsers = useMemo(() => {
    return members.map((member) => member.user_id)
  }, [members])

  const initialValues: EditProjectFormData = {
    name: project.name,
    description: project.description || '',
    priority: project.priority as any,
    status: project.status as any,
    start_date: project.start_date || '',
    end_date: project.end_date || '',
    assigned_users: currentAssignedUsers,
  }

  const handleSubmit = async (
    values: EditProjectFormData,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setError(null)
    setSuccess(null)
    setSubmitting(true)

    try {
      const projectData: Partial<UpdateProjectData> = {
        name: values.name,
        priority: values.priority,
        status: values.status,
      }

      if (values.description) {
        projectData.description = values.description
      }
      if (values.start_date) {
        projectData.start_date = values.start_date
      }
      if (values.end_date) {
        projectData.end_date = values.end_date
      }

      const updatedProject = await updateProject(project.id, projectData)

      // Handle user assignment changes
      if (values.assigned_users) {
        // TODO: Implement user assignment updates
        // This would require additional API calls to manage project_members
        // TODO: Implement user assignment updates
        // This would require additional API calls to manage project_members
      }

      setSuccess('Project updated successfully!')

      // Reset form and close modal after a short delay
      setTimeout(() => {
        setSuccess(null)
        onSuccess?.(updatedProject)
        onClose()
      }, 1500)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update project. Please try again.'
      setError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setError(null)
    setSuccess(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`max-w-2xl ${className || ''}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Project
          </DialogTitle>
          <DialogDescription>
            Update the project details below. Changes will be saved immediately.
          </DialogDescription>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="space-y-3">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Success Alert */}
              {success && (
                <Alert variant="default" className="border-green-200 bg-green-50 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Project Name */}
              <TextField
                name="name"
                label="Project Name"
                placeholder="Enter project name"
                required
                type="text"
              />

              {/* Description */}
              <TextareaField
                name="description"
                label="Description"
                placeholder="Enter project description"
                rows={3}
                maxLength={500}
                showCharacterCount
              />

              {/* Priority and Status Row */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Priority */}
                <SelectField
                  name="priority"
                  label="Priority"
                  placeholder="Select priority"
                  required
                  options={priorityOptions}
                />

                {/* Status */}
                <SelectField
                  name="status"
                  label="Status"
                  placeholder="Select status"
                  required
                  options={statusOptions}
                />
              </div>

              {/* Date Range Row */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Start Date */}
                <DateField name="start_date" label="Start Date" placeholder="Select start date" />

                {/* End Date */}
                <DateField name="end_date" label="End Date" placeholder="Select end date" />
              </div>

              {/* User Assignment */}
              <UserSelectField
                name="assigned_users"
                label="Assigned Users"
                placeholder="Select users assigned to this project..."
                multiple
                searchable
                clearable
                helperText="Manage users assigned to this project. Changes will update project membership."
              />

              {/* Form Actions */}
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={handleClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4" />
                      Update Project
                    </>
                  )}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default EditProjectModal
