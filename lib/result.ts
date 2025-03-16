export type Result<T = void, E extends Error = Error> =
  | { success: true; result: T }
  | { success: false; error: E };

/**
 * Creates a successful result. Can be called with no parameter for void results.
 */
export function ok<T = void, E extends Error = Error>(
  result?: T,
): Result<T, E> {
  return { success: true, result: result as T };
}

/**
 * Creates an error result.
 */
export function err<T, E extends Error = Error>(error: E): Result<T, E> {
  return { success: false, error };
}
