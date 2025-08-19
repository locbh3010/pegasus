/**
 * Type-safe object transformation utilities
 * Provides reusable functions for transforming database objects to application types
 */

// Base transformer function type
export type Transformer<TInput, TOutput> = (input: TInput) => TOutput

// Field transformer type for specific field transformations
export type FieldTransformer<TInput, TKey extends keyof TInput, TOutput> = (
  value: TInput[TKey]
) => TOutput

// Transform configuration for object fields
export type TransformConfig<TInput, TOutput> = {
  [K in keyof TOutput]?: K extends keyof TInput
    ? TInput[K] extends TOutput[K]
      ? TOutput[K] extends TInput[K]
        ? never // If types are exactly the same, no transformer needed
        : FieldTransformer<TInput, K, TOutput[K]> // Types are related but different, provide transformer
      : FieldTransformer<TInput, K, TOutput[K]> // Types are different, provide transformer
    : FieldTransformer<TInput, any, TOutput[K]> // For fields not in TInput
}

/**
 * Generic object transformer with type safety
 *
 * @param input - Source object to transform
 * @param config - Configuration object defining field transformations
 * @returns Transformed object with target type
 *
 * @example
 * ```typescript
 * const rawProject = { priority: 'high', status: 'active' }
 * const project = transformObject(rawProject, {
 *   priority: (value) => value as ProjectPriority,
 *   status: (value) => value as ProjectStatus,
 * })
 * ```
 */
export function transformObject<TInput, TOutput extends Record<string, any>>(
  input: TInput,
  config: TransformConfig<TInput, TOutput>
): TOutput {
  const result = { ...input } as any

  // Apply field transformations
  Object.entries(config).forEach(([key, transformer]) => {
    if (transformer && typeof transformer === 'function') {
      result[key] = transformer((input as any)[key])
    }
  })

  return result as TOutput
}

/**
 * Create a reusable transformer function
 *
 * @param config - Transformation configuration
 * @returns Reusable transformer function
 *
 * @example
 * ```typescript
 * const projectTransformer = createTransformer<Tables<'projects'>, Project>({
 *   priority: (value) => value as ProjectPriority,
 *   status: (value) => value as ProjectStatus,
 * })
 *
 * const project = projectTransformer(rawProject)
 * const projects = rawProjects.map(projectTransformer)
 * ```
 */
export function createTransformer<TInput, TOutput extends Record<string, any>>(
  config: TransformConfig<TInput, TOutput>
): Transformer<TInput, TOutput> {
  return (input: TInput) => transformObject(input, config)
}

/**
 * Transform array of objects
 *
 * @param items - Array of source objects
 * @param transformer - Transformer function or config
 * @returns Array of transformed objects
 */
export function transformArray<TInput, TOutput extends Record<string, any>>(
  items: TInput[],
  transformer: Transformer<TInput, TOutput> | TransformConfig<TInput, TOutput>
): TOutput[] {
  const transformFn =
    typeof transformer === 'function' ? transformer : createTransformer(transformer)

  return items.map(transformFn)
}

/**
 * Safe enum transformer - validates enum values
 *
 * @param enumObject - Enum object to validate against
 * @param fallback - Fallback value if validation fails
 * @returns Transformer function for the enum
 *
 * @example
 * ```typescript
 * const priorityTransformer = createEnumTransformer(ProjectPriority, ProjectPriority.MEDIUM)
 * const statusTransformer = createEnumTransformer(ProjectStatus, ProjectStatus.PLANNING)
 * ```
 */
export function createEnumTransformer<T extends Record<string, string>>(
  enumObject: T,
  fallback: T[keyof T]
): FieldTransformer<any, any, T[keyof T]> {
  const validValues = Object.values(enumObject)

  return (value: string): T[keyof T] => {
    if (validValues.includes(value as T[keyof T])) {
      return value as T[keyof T]
    }

    console.warn(`Invalid enum value: ${value}. Using fallback: ${fallback}`)
    return fallback
  }
}

/**
 * Date transformer utilities
 */
export const dateTransformers = {
  /**
   * Transform string to Date object
   */
  toDate: (value: string | null): Date | null => {
    if (!value) return null
    const date = new Date(value)
    return isNaN(date.getTime()) ? null : date
  },

  /**
   * Transform Date to ISO string
   */
  toISOString: (value: Date | null): string | null => {
    return value?.toISOString() || null
  },

  /**
   * Transform string to formatted date string
   */
  toDateString: (value: string | null): string | null => {
    if (!value) return null
    const date = new Date(value)
    return isNaN(date.getTime()) ? null : date.toLocaleDateString()
  },
}

/**
 * Number transformer utilities
 */
export const numberTransformers = {
  /**
   * Transform string to number with fallback
   */
  toNumber:
    (fallback: number = 0) =>
    (value: string | number | null): number => {
      if (typeof value === 'number') return value
      if (!value) return fallback
      const num = Number(value)
      return isNaN(num) ? fallback : num
    },

  /**
   * Transform to currency format
   */
  toCurrency: (value: number | null): string => {
    if (value === null || value === undefined) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  },
}

/**
 * Array transformer utilities
 */
export const arrayTransformers = {
  /**
   * Transform comma-separated string to array
   */
  fromString:
    (separator: string = ',') =>
    (value: string | null): string[] => {
      if (!value) return []
      return value
        .split(separator)
        .map((item) => item.trim())
        .filter(Boolean)
    },

  /**
   * Transform array to comma-separated string
   */
  toString:
    (separator: string = ', ') =>
    (value: string[]): string => {
      return value.join(separator)
    },

  /**
   * Ensure value is array
   */
  ensureArray: <T>(value: T | T[] | null): T[] => {
    if (value === null || value === undefined) return []
    return Array.isArray(value) ? value : [value]
  },
}
