/**
 * Default date field names that will be automatically converted from strings to Date objects
 */
const DEFAULT_DATE_FIELDS = ["createdAt", "updatedAt"] as const;

/**
 * Union type of the default date field names
 */
type DateFieldNames = typeof DEFAULT_DATE_FIELDS[number];

/**
 * Type transformation that converts string date fields to Date objects
 *
 * @template T - The input type to transform
 * @template K - String literal type of field names to treat as dates
 *
 * This type:
 * 1. Handles arrays by recursively applying the transformation to each element
 * 2. For objects, transforms string fields with names matching K to Date objects
 * 3. Handles nullable and optional date fields
 * 4. Recursively processes nested objects
 * 5. Preserves the original type for all other cases
 */
type WithParsedDates<T, K extends string> = T extends (infer U)[]
  ? WithParsedDates<U, K>[]
  : T extends object
    ? {
        [P in keyof T]: P extends K
          ? T[P] extends string | null | undefined
            ? Date | Extract<T[P], null | undefined>
            : T[P] extends string
              ? Date
              : T[P]
          : T[P] extends object
            ? WithParsedDates<T[P], K>
            : T[P];
      }
    : T;

/**
 * Converts string date fields to Date objects in an object or array of objects
 *
 * @template T - Type of the input data (object, array, null, or undefined)
 * @template K - Type of additional date field names
 *
 * @param data - The input data to process
 * @param extraFields - Additional field names to treat as dates beyond the defaults
 * @returns A deep copy of the input with date strings converted to Date objects
 *
 * @example
 * // Basic usage with default date fields (createdAt, updatedAt)
 * const user = withParsedDates({
 *   id: 1,
 *   name: 'John',
 *   createdAt: '2023-01-01T00:00:00.000Z'
 * });
 * // Result: { id: 1, name: 'John', createdAt: Date(...) }
 *
 * @example
 * // With custom date fields
 * const post = withParsedDates(
 *   {
 *     id: 1,
 *     title: 'Hello',
 *     publishedAt: '2023-01-15T00:00:00.000Z'
 *   },
 *   ['publishedAt']
 * );
 * // Result: { id: 1, title: 'Hello', publishedAt: Date(...) }
 */
export function withParsedDates<
  T extends Record<string, any> | Record<string, any>[] | null | undefined,
  K extends string = DateFieldNames,
>(data: T, extraFields: K[] = []): WithParsedDates<T, DateFieldNames | K> {
  // Return early for null, undefined, or non-object values
  if (data === null || data === undefined || typeof data !== "object") {
    return data as WithParsedDates<T, DateFieldNames | K>;
  }

  // Handle arrays by recursively processing each item
  if (Array.isArray(data)) {
    return data.map(item => withParsedDates(item, extraFields)) as WithParsedDates<T, DateFieldNames | K>;
  }

  // Create a shallow copy of the object to avoid mutating the original
  const result = { ...data } as Record<string, any>;
  // Combine default date fields with any extra fields provided
  const dateFields = [...DEFAULT_DATE_FIELDS, ...extraFields];

  // Process each property in the object
  for (const [key, value] of Object.entries(result)) {
    if (value && typeof value === "string" && dateFields.includes(key as any)) {
      // Convert string to Date if the field name is in dateFields
      result[key] = new Date(value);
    }
    else if (value && typeof value === "object") {
      // Recursively process nested objects
      result[key] = withParsedDates(value, extraFields);
    }
  }

  return result as WithParsedDates<T, DateFieldNames | K>;
}
