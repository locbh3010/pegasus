# Projects Feature - Type System

## Tổng quan

Projects feature sử dụng hệ thống type dựa trên Supabase types để đảm bảo type safety và tính nhất quán với database schema.

## Cấu trúc Type

### 1. Core Project Type

```typescript
// Project type kế thừa từ Supabase Tables<'projects'> với enum overrides
export interface Project extends Omit<Tables<'projects'>, 'priority' | 'status'> {
  priority: ProjectPriority
  status: ProjectStatus
}
```

**Lợi ích:**

- ✅ Tự động sync với database schema
- ✅ Type-safe với enum constants
- ✅ Không cần maintain duplicate types

### 2. Database Operation Types

```typescript
// Cho việc tạo project mới
export type CreateProjectData = Omit<TablesInsert<'projects'>, 'priority' | 'status'> & {
  priority: ProjectPriority
  status: ProjectStatus
}

// Cho việc update project
export type UpdateProjectData = Omit<TablesUpdate<'projects'>, 'priority' | 'status'> & {
  priority?: ProjectPriority
  status?: ProjectStatus
}
```

**Lợi ích:**

- ✅ Tự động có đúng required/optional fields từ Supabase
- ✅ Type-safe với enum values
- ✅ Không cần guess field types

### 3. Project Member Types

```typescript
// Trực tiếp từ Supabase
export type ProjectMember = Tables<'project_members'>
export type ProjectMemberInsert = TablesInsert<'project_members'>
export type ProjectMemberUpdate = TablesUpdate<'project_members'>
```

### 4. Form Data Types

```typescript
// Cho UI forms - có thể khác với database types
export interface CreateProjectFormData {
  name: string
  description?: string | undefined
  priority: ProjectPriority
  status: ProjectStatus
  start_date?: string | undefined
  end_date?: string | undefined
  assigned_users?: string[] | undefined // UI-specific field
}
```

## Cách sử dụng

### 1. Tạo Project mới

```typescript
import { CreateProjectData, Project } from '@/features/projects/types'

async function createProject(data: CreateProjectData): Promise<Project> {
  // data đã có đúng type từ Supabase TablesInsert
  const response = await supabase.from('projects').insert(data).select().single()

  return response.data
}
```

### 2. Update Project

```typescript
import { UpdateProjectData, Project } from '@/features/projects/types'

async function updateProject(id: string, data: UpdateProjectData): Promise<Project> {
  // data đã có đúng optional fields từ Supabase TablesUpdate
  const response = await supabase.from('projects').update(data).eq('id', id).select().single()

  return response.data
}
```

### 3. Sử dụng với Forms

```typescript
import { CreateProjectFormData } from '@/features/projects/types'

// Form validation với Yup
const validationSchema = Yup.object({
  name: Yup.string().required(),
  priority: Yup.string().oneOf(Object.values(PROJECT_PRIORITY)).required(),
  status: Yup.string().oneOf(Object.values(PROJECT_STATUS)).required(),
})

// Form submit handler
const handleSubmit = async (values: CreateProjectFormData) => {
  // Convert form data to database data
  const projectData: CreateProjectData = {
    name: values.name,
    description: values.description || null,
    priority: values.priority,
    status: values.status,
    start_date: values.start_date || null,
    end_date: values.end_date || null,
    created_by: currentUser.id,
  }

  await createProject(projectData)
}
```

## Enum Constants

### Project Priority

```typescript
// TypeScript enum for better type safety
export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

// Legacy constant for backward compatibility
export const PROJECT_PRIORITY = {
  LOW: ProjectPriority.LOW,
  MEDIUM: ProjectPriority.MEDIUM,
  HIGH: ProjectPriority.HIGH,
  URGENT: ProjectPriority.URGENT,
} as const
```

### Project Status

```typescript
// TypeScript enum for better type safety
export enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Legacy constant for backward compatibility
export const PROJECT_STATUS = {
  PLANNING: ProjectStatus.PLANNING,
  ACTIVE: ProjectStatus.ACTIVE,
  ON_HOLD: ProjectStatus.ON_HOLD,
  COMPLETED: ProjectStatus.COMPLETED,
  CANCELLED: ProjectStatus.CANCELLED,
} as const
```

## Best Practices

### 1. Luôn sử dụng Supabase types làm base

```typescript
// ✅ Tốt - kế thừa từ Supabase
export interface Project extends Omit<Tables<'projects'>, 'priority' | 'status'> {
  priority: ProjectPriority
  status: ProjectStatus
}

// ❌ Tránh - tự define từ đầu
export interface Project {
  id: string
  name: string
  // ... có thể miss fields hoặc sai type
}
```

### 2. Override enum fields khi cần

```typescript
// ✅ Tốt - override với enum type
export type CreateProjectData = Omit<TablesInsert<'projects'>, 'priority' | 'status'> & {
  priority: ProjectPriority
  status: ProjectStatus
}

// ❌ Tránh - để string generic
export type CreateProjectData = TablesInsert<'projects'>
```

### 3. Tách biệt Form types và Database types

```typescript
// ✅ Tốt - CreateProjectFormData extends từ database type
export interface CreateProjectFormData extends CreateProjectData {
  // Không cần assigned_users khi tạo project
  // Members sẽ được thêm sau khi project đã được tạo
}

// ✅ EditProjectFormData có thể có UI-specific fields
export interface EditProjectFormData extends UpdateProjectData {
  name: string // Required for edit forms
  assigned_users?: string[] // UI-specific field for editing
}
```

### 4. Không thêm members khi tạo project

```typescript
// ✅ Tốt - tạo project trước, thêm members sau
const newProject = await createProject({
  name: 'New Project',
  priority: ProjectPriority.HIGH,
  status: ProjectStatus.PLANNING,
  created_by: currentUser.id,
})

// Sau đó thêm members nếu cần
await addProjectMember({
  project_id: newProject.id,
  user_id: 'user_123',
  role: 'admin',
})

// ❌ Tránh - không thêm assigned_users trong create form
```

## Lợi ích của approach này

1. **Type Safety**: Tự động sync với database schema
2. **Maintainability**: Ít code duplicate, dễ maintain
3. **Developer Experience**: IntelliSense chính xác
4. **Error Prevention**: Catch type errors tại compile time
5. **Consistency**: Đảm bảo consistency giữa frontend và backend

## Xem thêm

- [Type Usage Examples](./examples/type-usage.ts) - Ví dụ chi tiết cách sử dụng
- [Supabase Types](../../types/supabase.ts) - Generated types từ Supabase
- [Project Constants](./constants/) - Enum definitions
