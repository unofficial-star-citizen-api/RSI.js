/**
 * Base class for every error thrown by RSI.js when RSI fails or answers unexpectedly.
 *
 * It is thrown when RSI returns a non-2xx status, an empty body, a payload with
 * `success !== 1`, or a page whose structure no longer matches the scraper.
 * More specific failures use a subclass: every "resource does not exist" case throws a
 * {@link RSINotFoundError} (status `404`), such as {@link RSIUserNotFoundError} or
 * {@link RSIOrganizationNotFoundError}.
 *
 * Invalid input (for example a malformed handle) throws a plain `Error` instead.
 *
 * @category Errors
 *
 * @example
 * ```typescript
 * import { RSI, RSIError, RSINotFoundError } from '@unofficial-star-citizen-api/rsi.js';
 *
 * const rsi = new RSI();
 *
 * try {
 *   await rsi.users.getProfile('someone');
 * } catch (error) {
 *   if (error instanceof RSINotFoundError) {
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

/**
 * Base class for every "resource does not exist" error: a citizen, an organization, a ship,
 * a star system... Catch it to handle any missing resource in one place, or catch a subclass
 * such as {@link RSIUserNotFoundError} to handle a single kind.
 *
 * @category Errors
 *
 * @example
 * ```typescript
 * import { RSI, RSINotFoundError } from '@unofficial-star-citizen-api/rsi.js';
 *
 * const rsi = new RSI();
 *
 * try {
 *   await rsi.organizations.get('NOTANORG');
 * } catch (error) {
 *   if (error instanceof RSINotFoundError)
 *     console.log(`${error.resource} "${error.identifier}" does not exist`); // Organization "NOTANORG" does not exist
 * }
 * ```
 */
export class RSINotFoundError extends RSIError
{
  /** Kind of resource that was not found, for example `User` or `Organization` */
  public readonly resource: string;

  /** Identifier that was looked up: a handle, a SID, an ID, a code or a slug */
  public readonly identifier: string | number;

  /**
   * @param resource - Kind of resource, for example `User`
   * @param identifier - Identifier that was looked up
   */
  constructor(resource: string, identifier: string | number)
  {
    super(`${resource} not found: ${identifier}`);
    this.name = 'RSINotFoundError';
    this.resource = resource;
    this.identifier = identifier;
  }

  /**
   * @returns `404`
   */
  getStatus(): number
  {
    return 404;
  }
}
