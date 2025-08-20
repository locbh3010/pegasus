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
import dayjs from 'dayjs'
import { Form, Formik } from 'formik'
import { AlertCircle, Plus } from 'lucide-react'
import { useState } from 'react'
import * as Yup from 'yup'
import { useCreateProject } from '../hooks/use-create-project'
import { ProjectPriority, ProjectStatus, type CreateProjectData } from '../types'
import { PROJECT_PRIORITY_MAP, PROJECT_STATUS_MAP } from '../constants'
import { capitalize, map } from 'lodash'

export interface CreateProjectModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
    className?: string
}

// Options for select fields
const priorityOptions: SelectOption[] = map(PROJECT_PRIORITY_MAP, (value, key) => ({
    value: key,
    label: capitalize(value.label),
}))

const statusOptions: SelectOption[] = map(PROJECT_STATUS_MAP, (value, key) => ({
    value: key,
    label: capitalize(value.label),
}))

// Validation schema
const validationSchema = Yup.object({
    name: Yup.string()
        .min(2, 'Project name must be at least 2 characters')
        .max(100, 'Project name must be less than 100 characters')
        .required('Project name is required'),
    description: Yup.string().max(500, 'Description must be less than 500 characters'),
    priority: Yup.string()
        .oneOf(Object.values(ProjectPriority) as string[], 'Please select a valid priority')
        .required('Priority is required'),
    status: Yup.string()
        .oneOf(Object.values(ProjectStatus) as string[], 'Please select a valid status')
        .required('Status is required'),
    start_date: Yup.string(),
    end_date: Yup.string().test(
        'is-after-start',
        'End date must be after start date',
        function (value) {
            const { start_date } = this.parent
            if (!value || !start_date) {
                return true
            }
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
    const { mutate: createProject, isPending } = useCreateProject()

    const [error, setError] = useState<string | null>(null)

    const handleClose = () => {
        setError(null)
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
                        Fill in the details below to create a new project. You can always edit these
                        later.
                    </DialogDescription>
                </DialogHeader>
                <Formik<CreateProjectData>
                    initialValues={{
                        name: '',
                        description: '',
                        start_date: dayjs().toISOString(),
                        priority: ProjectPriority.MEDIUM,
                        status: ProjectStatus.PLANNING,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        createProject(values, {
                            onSuccess: () => {
                                onClose()
                                onSuccess?.()
                                setSubmitting(false)
                                resetForm()
                            },
                            onError: (error) => {
                                setError(
                                    error instanceof Error
                                        ? error.message
                                        : 'Failed to create project'
                                )
                                setSubmitting(false)
                            },
                        })
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-3">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
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
                                <DateField
                                    name="start_date"
                                    label="Start Date"
                                    placeholder="Select start date"
                                />

                                {/* End Date */}
                                <DateField
                                    name="end_date"
                                    label="End Date"
                                    placeholder="Select end date"
                                />
                            </div>

                            {/* Form Actions */}
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="text-destructive"
                                    onClick={handleClose}
                                    disabled={isSubmitting || isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || isPending}
                                    className="gap-2"
                                >
                                    {isSubmitting || isPending ? (
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
