import { RSIError } from '@/errors';

/**
 * Thrown when no citizen exists for the requested handle.
 *
 * @category Errors
 *
 * @example
 * ```typescript
 * import { RSI, RSIUserNotFoundError } from '@unofficial-star-citizen-api/rsi.js';
 *
 * const rsi = new RSI();
 *
 * try {
 *   await rsi.users.getProfile('nobody-has-this-handle');
 * } catch (error) {
 *   if (error instanceof RSIUserNotFoundError)
 *     console.log('No such citizen');
 * }
 * ```
 */
export class RSIUserNotFoundError extends RSIError
{
  /**
   * @param handle - The citizen handle that was not found
   */
  constructor(handle: string)
  {
    super(`User not found: ${handle}`);
    this.name = 'RSIUserNotFoundError';
  }

  /**
   * @returns `404`
   */
  getStatus(): number
  {
    return 404;
  }
}
