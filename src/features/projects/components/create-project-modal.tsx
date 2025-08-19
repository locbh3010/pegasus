'use client'

import {
  DateField,
  SelectField,
  TextField,
  TextareaField,
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
import { AlertCircle, CheckCircle, Plus } from 'lucide-react'
import { useState } from 'react'
import * as Yup from 'yup'
import { useProjects } from '../context'
import type { CreateProjectFormData, CreateProjectModalProps } from '../types'
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
    .min(3, 'Project name must be at least 3 characters')
    .max(100, 'Project name must be less than 100 characters')
    .required('Project name is required'),
  description: Yup.string().max(500, 'Description must be less than 500 characters'),
  priority: Yup.string()
    .oneOf(Object.values(PROJECT_PRIORITY), 'Please select a valid priority')
    .required('Priority is required'),
  status: Yup.string()
    .oneOf(Object.values(PROJECT_STATUS), 'Please select a valid status')
    .required('Status is required'),
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
})

export function CreateProjectModal({
  isOpen,
  onClose,
  onSuccess,
  className,
}: CreateProjectModalProps) {
  const { createProject } = useProjects()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const initialValues: CreateProjectFormData = {
    name: '',
    description: '',
    priority: 'medium',
    status: 'planning',
    start_date: '',
    end_date: '',
  }

  const handleSubmit = async (
    values: CreateProjectFormData,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    setError(null)
    setSuccess(null)

    try {
      const projectData: CreateProjectFormData = {
        name: values.name,
        description: values.description || undefined,
        priority: values.priority,
        status: values.status,
        start_date: values.start_date || undefined,
        end_date: values.end_date || undefined,
      }

      const newProject = await createProject(projectData)
      setSuccess('Project created successfully!')

      // Reset form and close modal after a short delay
      setTimeout(() => {
        resetForm()
        setSuccess(null)
        onSuccess?.(newProject)
        onClose()
      }, 1500)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create project. Please try again.'
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
            <Plus className="h-5 w-5" />
            Create New Project
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new project. You can always edit these later.
          </DialogDescription>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
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
                <Alert className="border-green-200 bg-green-50 text-green-800">
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

              {/* Form Actions */}
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-destructive"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Project
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
