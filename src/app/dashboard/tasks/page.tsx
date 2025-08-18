'use client'

// import { useAuth } from '@/features/auth/components/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Calendar, User } from 'lucide-react'

export default function TasksPage() {
  const tasks = [
    {
      id: 1,
      title: 'Complete project documentation',
      description: 'Write comprehensive documentation for the new feature',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2024-01-15',
      assignee: 'John Doe',
    },
    {
      id: 2,
      title: 'Review pull requests',
      description: 'Review and approve pending pull requests',
      status: 'completed',
      priority: 'medium',
      dueDate: '2024-01-14',
      assignee: 'Jane Smith',
    },
    {
      id: 3,
      title: 'Update user interface',
      description: 'Implement new design system components',
      status: 'pending',
      priority: 'low',
      dueDate: '2024-01-20',
      assignee: 'Mike Johnson',
    },
    {
      id: 4,
      title: 'Fix authentication bug',
      description: 'Resolve OAuth redirect issue',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2024-01-16',
      assignee: 'Sarah Wilson',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-orange-100 text-orange-800'
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage and track your tasks and projects.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <CardDescription>{task.description}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                  <Badge className={getStatusColor(task.status)}>
                    {task.status.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  Due {task.dueDate}
                </div>
                <div className="flex items-center">
                  <User className="mr-1 h-4 w-4" />
                  {task.assignee}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
