/**
 * Base class for every error thrown by RSI.js when RSI fails or answers unexpectedly.
 *
 * It is thrown when RSI returns a non-2xx status, an empty body, a payload with
 * `success !== 1`, or a page whose structure no longer matches the scraper.
 * More specific failures use a subclass, such as {@link RSIUserNotFoundError} or
 * {@link RSIOrganizationNotFoundError}.
 *
 * Invalid input (for example a malformed handle) throws a plain `Error` instead.
 *
 * @category Errors
 *
 * @example
 * ```typescript
 * import { RSI, RSIError, RSIUserNotFoundError } from '@unofficial-star-citizen-api/rsi.js';
 *
 * const rsi = new RSI();
 *
 * try {
 *   await rsi.users.getProfile('someone');
 * } catch (error) {
 *   if (error instanceof RSIUserNotFoundError) {
 *     // 404: the handle does not exist
 *   } else if (error instanceof RSIError) {
 *     // RSI is down, rate-limiting you, or changed its page
 *     console.error(error.getStatus(), error.message);
 *   } else {
 *     throw error;
 *   }
 * }
 * ```
 */
export class RSIError extends Error
{
  /**
   * @param message - Description of the failure
   * @param originalError - Underlying error, appended to the stack trace as `Caused by:`
   */
  constructor(message: string, originalError?: Error)
  {
    super(message);
    this.name = 'RSIError';
    if (originalError)
    {
      this.stack += '\nCaused by: ' + originalError.stack;
    }
  }

  /**
   * Suggested HTTP status code for this error, useful when RSI.js runs behind your own API.
   *
   * @returns `500` for a generic upstream failure; subclasses return a more specific code
   */
  getStatus(): number
  {
    return 500;
  }
}
