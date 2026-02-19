import { Response } from 'express';
import { z } from 'zod';

/**
 * Validates any object against a Zod schema.
 * If validation fails, sends a 400 error response and returns null.
 * If validation succeeds, returns the validated data.
 *
 * @param schema - Zod schema to validate against
 * @param data - Object to validate (e.g., req.query, req.params, req.body)
 * @param res - Express Response object
 * @param errorMessage - Optional custom error message (default: 'Invalid parameters')
 * @returns Validated data or null if validation failed
 *
 * @example
 * ```ts
 * // Validate query parameters
 * const query = validate(z.object({ state: z.string() }), req.query, res);
 * if (!query) return; // Error already sent
 *
 * // Validate route parameters
 * const params = validate(z.object({ id: z.string() }), req.params, res);
 * if (!params) return; // Error already sent
 * ```
 */
export function validate<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
  res: Response,
  errorMessage: string = 'Invalid parameters'
): z.infer<T> | null {
  const parseResult = schema.safeParse(data);

  if (!parseResult.success) {
    res.status(400).json({
      error: errorMessage,
      details: parseResult.error.issues,
    });
    return null;
  }

  return parseResult.data;
}
