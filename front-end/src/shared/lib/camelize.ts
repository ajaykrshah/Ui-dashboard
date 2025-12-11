/**
 * Converts object keys from snake_case to camelCase recursively.
 *
 * This utility is commonly used when transforming API responses from backend services
 * that use snake_case conventions (like Python/Django REST Framework, Ruby on Rails)
 * to JavaScript/TypeScript frontend code that follows camelCase conventions.
 *
 * @example
 * ```typescript
 * // API response from backend
 * const apiResponse = {
 *   user_id: 123,
 *   first_name: "John",
 *   last_name: "Doe",
 *   user_preferences: {
 *     email_notifications: true,
 *     theme_mode: "dark"
 *   },
 *   recent_orders: [
 *     { order_id: 456, order_date: "2024-01-01" }
 *   ]
 * };
 *
 * const camelizedData = camelizeKeys(apiResponse);
 * // Result:
 * // {
 * //   userId: 123,
 * //   firstName: "John",
 * //   lastName: "Doe",
 * //   userPreferences: {
 * //     emailNotifications: true,
 * //     themeMode: "dark"
 * //   },
 * //   recentOrders: [
 * //     { orderId: 456, orderDate: "2024-01-01" }
 * //   ]
 * // }
 * ```
 *
 * @param obj - The object, array, or primitive value to transform
 * @returns The transformed object with camelCase keys, or the original value if it's a primitive
 */
export function camelizeKeys(obj: any): any {
  // Handle arrays by recursively processing each element
  if (Array.isArray(obj)) {
    return obj.map(camelizeKeys);
  }
  // Handle objects by transforming keys and recursively processing values
  else if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      // Convert snake_case to camelCase using regex
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      // Recursively process the value
      acc[camelKey] = camelizeKeys(value);
      return acc;
    }, {} as any);
  }
  // Return primitive values unchanged (strings, numbers, booleans, null, undefined)
  return obj;
}
