'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import queryString from 'query-string'
import { useCallback, useMemo } from 'react'

export interface QueryParamsReturn<T extends Record<string, unknown>> {
  params: T
  has: (key: keyof T) => boolean
  setParams: (updates: Partial<T>) => void
  deleteParam: (key: keyof T) => void
  getParam: (key: keyof T) => T[keyof T] | undefined
  resetParams: () => void
  hasFilters: () => boolean
}

/**
 * Type-safe URL query parameter management hook using Next.js useSearchParams and query-string library
 *
 * @param defaultParams - Object containing default values for query parameters
 * @returns Object with current params and methods to manipulate them
 *
 * @example
 * ```typescript
 * const { params, has, setParams, deleteParam, getParam } = useQueryParams({
 *   page: 1,
 *   limit: 10,
 *   search: ''
 * })
 *
 * // Update specific parameters while preserving existing ones
 * setParams({ page: 2 }) // Results in { page: 2, limit: 10, search: '' }
 *
 * // Check if parameter exists in URL
 * const hasSearch = has('search')
 *
 * // Get specific parameter value
 * const currentPage = getParam('page')
 *
 * // Remove parameter from URL
 * deleteParam('search')
 * ```
 */
export function useQueryParams<T extends Record<string | number | symbol, unknown>>(
  defaultParams: T,
  types?: Record<
    string,
    'string' | 'number' | 'boolean' | 'string[]' | 'number[]' | ((value: string) => unknown)
  >
): QueryParamsReturn<T> {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Parse current URL parameters and merge with defaults
  const params = useMemo(() => {
    const currentParams = queryString.parse(searchParams.toString(), {
      parseNumbers: true,
      parseBooleans: true,
      arrayFormat: 'bracket',
      types: types || {},
    })

    // Start with defaults, then merge all URL params
    const mergedParams = { ...defaultParams } as T

    // Merge all current params from URL (not just those in defaults)
    Object.keys(currentParams).forEach((key) => {
      const currentValue = currentParams[key]

      if (currentValue !== undefined && currentValue !== null && currentValue !== '') {
        mergedParams[key as keyof T] = currentValue as T[keyof T]
      }
    })

    return mergedParams
  }, [searchParams, defaultParams, types])

  // Check if a specific parameter key exists in the URL
  const has = useCallback(
    (key: keyof T): boolean => {
      return searchParams.has(String(key))
    },
    [searchParams]
  )

  // Get the value of a specific parameter
  const getParam = useCallback(
    (key: keyof T): T[keyof T] | undefined => {
      const value = searchParams.get(String(key))
      if (value === null) {
        return undefined
      }

      // Try to parse the value to match the default type
      const defaultValue = defaultParams[key]
      if (typeof defaultValue === 'number') {
        const num = Number(value)
        return !isNaN(num) && isFinite(num) ? (num as T[keyof T]) : undefined
      }
      if (typeof defaultValue === 'boolean') {
        if (value === 'true') {
          return true as T[keyof T]
        }
        if (value === 'false') {
          return false as T[keyof T]
        }
        return undefined
      }

      return value as T[keyof T]
    },
    [searchParams, defaultParams]
  )

  // Update specific parameters while preserving existing ones
  const setParams = useCallback(
    (updates: Partial<T>): void => {
      const currentParams = queryString.parse(searchParams.toString(), {
        parseNumbers: true,
        parseBooleans: true,
        arrayFormat: 'bracket',
      })

      // Merge updates with current params
      const newParams = { ...currentParams, ...updates }

      // Remove undefined, null, and empty string values
      Object.keys(newParams).forEach((key) => {
        const value = newParams[key]
        if (value === undefined || value === null || value === '') {
          delete newParams[key]
        }
      })

      // Build new query string
      const newQueryString = queryString.stringify(newParams, {
        skipNull: true,
        skipEmptyString: true,
        arrayFormat: 'bracket',
      })

      // Navigate to new URL with updated query parameters
      const newUrl = newQueryString ? `${pathname}?${newQueryString}` : pathname
      router.push(newUrl, { scroll: false })
    },
    [searchParams, pathname, router]
  )

  // Remove a specific parameter from the URL
  const deleteParam = useCallback(
    (key: keyof T): void => {
      const currentParams = queryString.parse(searchParams.toString(), {
        parseNumbers: true,
        parseBooleans: true,
        arrayFormat: 'bracket',
      })

      // Remove the specified key
      delete currentParams[String(key)]

      // Build new query string
      const newQueryString = queryString.stringify(currentParams, {
        skipNull: true,
        skipEmptyString: true,
        arrayFormat: 'bracket',
      })

      // Navigate to new URL without the deleted parameter
      const newUrl = newQueryString ? `${pathname}?${newQueryString}` : pathname
      router.push(newUrl, { scroll: false })
    },
    [searchParams, pathname, router]
  )

  // Reset all parameters to their default values
  const resetParams = useCallback((): void => {
    // Navigate to URL with no query parameters (all defaults will be used)
    router.push(pathname, { scroll: false })
  }, [pathname, router])

  // Check if current params differ from default values
  const hasFilters = useCallback((): boolean => {
    return Object.keys(defaultParams).some((key) => {
      const currentValue = params[key as keyof T]
      const defaultValue = defaultParams[key as keyof T]

      // Deep comparison for arrays
      if (Array.isArray(currentValue) && Array.isArray(defaultValue)) {
        return JSON.stringify(currentValue) !== JSON.stringify(defaultValue)
      }

      // Simple comparison for other types
      return currentValue !== defaultValue
    })
  }, [params, defaultParams])

  return {
    params,
    has,
    setParams,
    deleteParam,
    getParam,
    resetParams,
    hasFilters,
  }
}
