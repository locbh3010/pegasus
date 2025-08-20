# Type-Safe Axios Configuration

This document explains how to use the enhanced type-safe axios configuration in the task manager application.

## Overview

The axios configuration has been enhanced with comprehensive TypeScript support, providing:

- **Type-safe requests and responses**
- **Automatic error handling with standardized error types**
- **Retry logic with exponential backoff**
- **Request/response interceptors with proper typing**
- **Utility functions for common API patterns**
- **Authentication token management (ready for implementation)**

## Key Features

### 1. Type-Safe HTTP Methods

All HTTP methods are properly typed with generics:

```typescript
// GET request with typed response
const user = await api.get<User>(`/users/${userId}`)

// POST request with typed data and response
const newUser = await api.post<User, CreateUserData>('/users', userData)

// PUT/PATCH/DELETE with proper typing
const updatedUser = await api.put<User, UpdateUserData>(`/users/${userId}`, updates)
const patchedUser = await api.patch<User, Partial<User>>(`/users/${userId}`, partialUpdates)
const result = await api.delete<{ deleted: boolean }>(`/users/${userId}`)
```

### 2. API Response Wrappers

Use utility functions for standardized API responses:

```typescript
// Standard API response with success/error handling
const response = await apiUtils.getApiResponse<User>(`/users/${userId}`)
if (response.success) {
    console.log(response.data) // Typed as User
}

// Paginated responses
const paginatedUsers = await apiUtils.getPaginated<User>('/users', { page: 1, limit: 10 })
console.log(paginatedUsers.pagination.total) // Type-safe pagination info
```

### 3. Enhanced Error Handling

Errors are automatically standardized and typed:

```typescript
try {
    const user = await api.get<User>(`/users/${userId}`)
} catch (error) {
    // Error is typed as ApiErrorResponse
    const apiError = error as ApiErrorResponse
    console.log(apiError.error.status) // HTTP status code
    console.log(apiError.error.message) // Error message
    console.log(apiError.error.details) // Additional error details
}
```

### 4. Request Configuration Options

Enhanced configuration options for fine-grained control:

```typescript
const config: ApiRequestConfig = {
    skipAuth: true, // Skip authentication for this request
    skipErrorHandling: true, // Handle errors manually
    maxRetries: 5, // Custom retry count
    timeout: 15000, // Custom timeout
    params: { search: 'john' }, // Query parameters
}

const user = await api.get<User>('/users/search', config)
```

### 5. Automatic Retry Logic

Failed requests are automatically retried with exponential backoff:

- **Network errors**: Retried up to 3 times by default
- **5xx server errors**: Retried with exponential backoff
- **4xx client errors**: Not retried (immediate failure)
- **Configurable**: Set custom `maxRetries` in request config

### 6. Authentication Integration

Ready for authentication token integration:

```typescript
// TODO: Implement in request interceptor
// const token = getAuthToken()
// if (token && !config.skipAuth) {
//   config.headers.Authorization = `Bearer ${token}`
// }
```

## Usage Examples

### Basic CRUD Operations

```typescript
// Create
const newUser = await apiUtils.postApiResponse<User, CreateUserData>('/users', userData)

// Read
const user = await api.get<User>(`/users/${userId}`)
const users = await apiUtils.getPaginated<User>('/users', { page: 1, limit: 10 })

// Update
const updatedUser = await apiUtils.putApiResponse<User, UpdateUserData>(`/users/${userId}`, updates)

// Delete
const result = await apiUtils.deleteApiResponse<{ deleted: boolean }>(`/users/${userId}`)
```

### Complex Queries

```typescript
const tasks = await apiUtils.getPaginated<Task>('/tasks/search', {
    search: 'urgent',
    status: ['pending', 'in-progress'],
    assignedTo: userId,
    page: 1,
    limit: 20,
})
```

### File Uploads

```typescript
const formData = new FormData()
formData.append('avatar', file)

const result = await api.post<{ url: string }, FormData>(`/users/${userId}/avatar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
})
```

### Error Handling Patterns

```typescript
// Pattern 1: Using try-catch with typed errors
try {
    const user = await api.get<User>(`/users/${userId}`)
    return user
} catch (error) {
    const apiError = error as ApiErrorResponse

    switch (apiError.error.status) {
        case 404:
            return null // User not found
        case 403:
            throw new Error('Access denied')
        default:
            throw error
    }
}

// Pattern 2: Using skipErrorHandling for custom handling
const user = await api
    .get<User>(`/users/${userId}`, {
        skipErrorHandling: true,
    })
    .catch((error) => {
        // Custom error handling logic
        return null
    })
```

### Concurrent Requests

```typescript
const [user, tasks, projects] = await Promise.all([
    api.get<User>(`/users/${userId}`),
    api.get<Task[]>(`/users/${userId}/tasks`),
    api.get<Project[]>(`/users/${userId}/projects`),
])
```

### Request Cancellation

```typescript
const controller = new AbortController()

const userPromise = api.get<User>(`/users/${userId}`, {
    signal: controller.signal,
})

// Cancel after 5 seconds
setTimeout(() => controller.abort(), 5000)
```

## Type Definitions

### Core Types

```typescript
interface ApiRequestConfig extends AxiosRequestConfig {
    skipAuth?: boolean
    skipErrorHandling?: boolean
    retryCount?: number
    maxRetries?: number
}

interface ApiError {
    message: string
    status?: number | undefined
    code?: string | undefined
    details?: Record<string, unknown> | undefined
}

interface ApiErrorResponse {
    error: ApiError
    success: false
    timestamp: string
}
```

### Response Types

```typescript
interface ApiResponse<T> {
    data: T
    message?: string
    success: boolean
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}
```

## Best Practices

1. **Always specify response types**: Use generics to ensure type safety
2. **Use utility functions**: Prefer `apiUtils` for standardized responses
3. **Handle errors appropriately**: Use typed error handling patterns
4. **Configure retries wisely**: Set appropriate `maxRetries` for critical requests
5. **Use request cancellation**: Implement AbortController for long-running requests
6. **Validate external data**: Use runtime validation (Zod) for API responses
7. **Keep types in sync**: Update types when API contracts change

## Migration Guide

### From Old Configuration

```typescript
// Old way
const response = await api.post('/users', userData)
if (response?.status !== 200) {
    throw new Error(response?.message)
}
return response.data

// New way
const response = await apiUtils.postApiResponse<User, CreateUserData>('/users', userData)
if (!response.success) {
    throw new Error(response.message)
}
return response.data
```

### Error Handling Migration

```typescript
// Old way
try {
    const response = await api.get('/users/123')
    return response.data
} catch (error) {
    return error.response.data
}

// New way
try {
    return await api.get<User>('/users/123')
} catch (error) {
    const apiError = error as ApiErrorResponse
    console.error(apiError.error.message)
    throw error
}
```

## Testing

When writing tests, you can mock the typed axios instance:

```typescript
import { api } from '@/lib/axios'

jest.mock('@/lib/axios', () => ({
    api: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
    },
    apiUtils: {
        getApiResponse: jest.fn(),
        postApiResponse: jest.fn(),
        // ... other utility methods
    },
}))

// In your test
const mockApi = api as jest.Mocked<typeof api>
mockApi.get.mockResolvedValue(mockUser)
```

## Future Enhancements

- [ ] Implement authentication token management
- [ ] Add request/response logging in development
- [ ] Implement request deduplication
- [ ] Add response caching layer
- [ ] Integrate with React Query for better state management
- [ ] Add request metrics and monitoring
