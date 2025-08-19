# useQueryParams Hook

A type-safe URL query parameter management hook for Next.js applications using `useSearchParams` and the `query-string` library.

## Features

- **Type Safety**: Full TypeScript support with generic types
- **Automatic Type Conversion**: Handles numbers, booleans, arrays, and objects
- **Merge Behavior**: `setParams` merges updates with existing parameters
- **URL Synchronization**: All changes are reflected in the browser URL
- **Default Values**: Provides fallback values when parameters are missing
- **Edge Case Handling**: Properly handles undefined, null, and empty values

## Installation

The hook uses the `query-string` library which is already installed in this project. If you need to install it separately:

```bash
yarn add query-string
```

## Basic Usage

```typescript
import { useQueryParams } from '@/hooks/use-query-params'

function MyComponent() {
  const { params, has, setParams, deleteParam, getParam } = useQueryParams({
    page: 1,
    limit: 10,
    search: '',
    active: true
  })

  // Current parameters (merged with defaults)
  console.log(params) // { page: 1, limit: 10, search: '', active: true }

  // Update parameters (merges with existing)
  const handlePageChange = (newPage: number) => {
    setParams({ page: newPage }) // Preserves limit, search, active
  }

  // Check if parameter exists in URL
  const hasSearch = has('search') // boolean

  // Get specific parameter value
  const currentPage = getParam('page') // number | undefined

  // Remove parameter from URL
  const clearSearch = () => {
    deleteParam('search')
  }

  return (
    <div>
      <p>Current page: {params.page}</p>
      <button onClick={() => handlePageChange(params.page + 1)}>
        Next Page
      </button>
    </div>
  )
}
```

## API Reference

### Hook Signature

```typescript
useQueryParams<T extends Record<string, any>>(defaultParams: T): QueryParamsReturn<T>
```

### Parameters

- `defaultParams`: Object containing default values for query parameters

### Return Value

```typescript
interface QueryParamsReturn<T> {
  params: T // Current parameters merged with defaults
  has: (key: keyof T) => boolean // Check if parameter exists in URL
  setParams: (updates: Partial<T>) => void // Update parameters (merges with existing)
  deleteParam: (key: keyof T) => void // Remove parameter from URL
  getParam: (key: keyof T) => T[keyof T] | undefined // Get specific parameter value
}
```

## Advanced Examples

### Complex Data Types

```typescript
const { params, setParams } = useQueryParams({
  filters: {
    category: '',
    priceRange: [0, 1000],
  },
  tags: [] as string[],
  sortBy: 'name' as 'name' | 'date' | 'price',
})

// Update nested object
setParams({
  filters: {
    ...params.filters,
    category: 'electronics',
  },
})

// Update array
setParams({
  tags: [...params.tags, 'new-tag'],
})
```

### Pagination with Search

```typescript
const { params, setParams, deleteParam } = useQueryParams({
  page: 1,
  limit: 10,
  search: '',
  sortBy: 'created_at',
  sortOrder: 'desc' as 'asc' | 'desc',
})

const handleSearch = (searchTerm: string) => {
  if (searchTerm) {
    setParams({ search: searchTerm, page: 1 }) // Reset to first page
  } else {
    deleteParam('search') // Remove empty search
  }
}

const handleSort = (field: string) => {
  const newOrder = params.sortBy === field && params.sortOrder === 'asc' ? 'desc' : 'asc'
  setParams({ sortBy: field, sortOrder: newOrder })
}
```

### Form State Synchronization

```typescript
const { params, setParams } = useQueryParams({
  name: '',
  email: '',
  department: '',
  active: true
})

// Sync form with URL parameters
const handleFormChange = (field: string, value: any) => {
  setParams({ [field]: value })
}

// Form values are automatically synced with URL
<input
  value={params.name}
  onChange={(e) => handleFormChange('name', e.target.value)}
/>
```

## Type Safety

The hook provides full type safety:

```typescript
const { params, setParams } = useQueryParams({
  count: 0,
  enabled: false,
  category: 'all' as 'all' | 'active' | 'inactive',
})

// ✅ Type-safe updates
setParams({ count: 42 })
setParams({ enabled: true })
setParams({ category: 'active' })

// ❌ TypeScript errors
setParams({ count: 'invalid' }) // Error: string not assignable to number
setParams({ enabled: 'yes' }) // Error: string not assignable to boolean
setParams({ category: 'invalid' }) // Error: not assignable to union type
```

## URL Behavior

- Parameters are automatically encoded/decoded using the `qs` library
- Arrays are formatted with brackets: `?tags[0]=frontend&tags[1]=backend`
- Objects use dot notation: `?filters.category=electronics&filters.price=100`
- Boolean values are serialized as `'true'`/`'false'` strings
- Numbers are automatically parsed from strings
- Empty strings, `null`, and `undefined` values are removed from the URL
- Navigation uses `router.push()` with `scroll: false` to prevent page jumps

## Best Practices

1. **Define Default Values**: Always provide sensible defaults for all parameters
2. **Use Type Unions**: For limited string values, use union types for better type safety
3. **Reset Pagination**: When filtering/searching, reset page to 1
4. **Handle Empty Values**: Use `deleteParam()` to remove empty search terms
5. **Batch Updates**: Use `setParams()` with multiple properties to update several parameters at once

## Integration with Data Fetching

```typescript
const { params } = useQueryParams({
  page: 1,
  limit: 10,
  search: '',
  category: '',
})

// Use with TanStack Query
const { data, isLoading } = useQuery({
  queryKey: ['items', params],
  queryFn: () => fetchItems(params),
  keepPreviousData: true,
})

// Use with SWR
const { data, error } = useSWR(['items', params], () => fetchItems(params))
```

This hook provides a robust, type-safe solution for managing URL query parameters in Next.js applications while maintaining excellent developer experience and runtime safety.
