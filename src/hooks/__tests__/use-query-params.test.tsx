/**
 * Test file demonstrating useQueryParams hook usage
 * This is a basic example showing how the hook should be used
 */

import React from 'react'
import { useQueryParams } from '../use-query-params'

// Example component demonstrating the hook usage
export function QueryParamsExample() {
  const { params, has, setParams, deleteParam, getParam } = useQueryParams({
    page: 1,
    limit: 10,
    search: '',
    active: true,
    tags: [] as string[],
  })

  const handlePageChange = (newPage: number) => {
    setParams({ page: newPage })
  }

  const handleSearchChange = (search: string) => {
    setParams({ search, page: 1 }) // Reset to first page when searching
  }

  const handleLimitChange = (limit: number) => {
    setParams({ limit, page: 1 }) // Reset to first page when changing limit
  }

  const handleToggleActive = () => {
    setParams({ active: !params.active })
  }

  const handleClearSearch = () => {
    deleteParam('search')
  }

  const handleAddTag = (tag: string) => {
    const currentTags = params.tags || []
    setParams({ tags: [...currentTags, tag] })
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = params.tags || []
    setParams({ tags: currentTags.filter((tag) => tag !== tagToRemove) })
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Query Params Example</h2>

      {/* Current params display */}
      <div className="rounded bg-gray-100 p-3">
        <h3 className="font-semibold">Current Params:</h3>
        <pre>{JSON.stringify(params, null, 2)}</pre>
      </div>

      {/* Page controls */}
      <div className="space-y-2">
        <h3 className="font-semibold">Page Controls:</h3>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(params.page - 1)}
            disabled={params.page <= 1}
            className="rounded bg-blue-500 px-3 py-1 text-white disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">Page {params.page}</span>
          <button
            onClick={() => handlePageChange(params.page + 1)}
            className="rounded bg-blue-500 px-3 py-1 text-white"
          >
            Next
          </button>
        </div>
      </div>

      {/* Search controls */}
      <div className="space-y-2">
        <h3 className="font-semibold">Search Controls:</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={params.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search..."
            className="rounded border px-3 py-1"
          />
          {has('search') && (
            <button onClick={handleClearSearch} className="rounded bg-red-500 px-3 py-1 text-white">
              Clear
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600">Has search param: {has('search') ? 'Yes' : 'No'}</p>
      </div>

      {/* Limit controls */}
      <div className="space-y-2">
        <h3 className="font-semibold">Limit Controls:</h3>
        <select
          value={params.limit}
          onChange={(e) => handleLimitChange(Number(e.target.value))}
          className="rounded border px-3 py-1"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>

      {/* Active toggle */}
      <div className="space-y-2">
        <h3 className="font-semibold">Active Filter:</h3>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={params.active} onChange={handleToggleActive} />
          Show active only
        </label>
        <p className="text-sm text-gray-600">Active value: {getParam('active')?.toString()}</p>
      </div>

      {/* Tags controls */}
      <div className="space-y-2">
        <h3 className="font-semibold">Tags:</h3>
        <div className="flex flex-wrap gap-2">
          {(params.tags || []).map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-800"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleAddTag('frontend')}
            className="rounded bg-green-500 px-3 py-1 text-sm text-white"
          >
            Add &quot;frontend&quot;
          </button>
          <button
            onClick={() => handleAddTag('backend')}
            className="rounded bg-green-500 px-3 py-1 text-sm text-white"
          >
            Add &quot;backend&quot;
          </button>
          <button
            onClick={() => handleAddTag('urgent')}
            className="rounded bg-green-500 px-3 py-1 text-sm text-white"
          >
            Add &quot;urgent&quot;
          </button>
        </div>
      </div>

      {/* Method demonstrations */}
      <div className="space-y-2">
        <h3 className="font-semibold">Method Examples:</h3>
        <div className="space-y-1 text-sm">
          <p>has(&apos;page&apos;): {has('page').toString()}</p>
          <p>getParam(&apos;page&apos;): {getParam('page')}</p>
          <p>
            getParam(&apos;nonexistent&apos;):{' '}
            {getParam('nonexistent' as keyof typeof params)?.toString() || 'undefined'}
          </p>
        </div>
      </div>
    </div>
  )
}

// Type safety demonstration
export function TypeSafetyExample() {
  // This demonstrates the type safety of the hook
  const { params, setParams } = useQueryParams({
    userId: 0,
    isAdmin: false,
    categories: [] as string[],
    sortBy: 'name' as 'name' | 'date' | 'priority',
  })

  // TypeScript will enforce these types
  const handleUpdateUserId = (id: number) => {
    setParams({ userId: id }) // ✅ Correct type
    // setParams({ userId: &apos;invalid&apos; }) // ❌ TypeScript error
  }

  const handleToggleAdmin = () => {
    setParams({ isAdmin: !params.isAdmin }) // ✅ Correct type
    // setParams({ isAdmin: &apos;yes&apos; }) // ❌ TypeScript error
  }

  const handleUpdateSort = (sort: 'name' | 'date' | 'priority') => {
    setParams({ sortBy: sort }) // ✅ Correct type
    // setParams({ sortBy: &apos;invalid&apos; }) // ❌ TypeScript error
  }

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Type Safety Example</h2>
      <p className="text-sm text-gray-600">
        This component demonstrates the type safety provided by the useQueryParams hook. All
        parameter updates are type-checked at compile time.
      </p>

      <div className="mt-4 rounded bg-gray-100 p-3">
        <pre>{JSON.stringify(params, null, 2)}</pre>
      </div>

      <div className="mt-4 space-y-2">
        <button
          onClick={() => handleUpdateUserId(123)}
          className="mr-2 rounded bg-blue-500 px-3 py-1 text-white"
        >
          Set User ID to 123
        </button>
        <button
          onClick={handleToggleAdmin}
          className="mr-2 rounded bg-purple-500 px-3 py-1 text-white"
        >
          Toggle Admin
        </button>
        <button
          onClick={() => handleUpdateSort('date')}
          className="rounded bg-green-500 px-3 py-1 text-white"
        >
          Sort by Date
        </button>
      </div>
    </div>
  )
}
