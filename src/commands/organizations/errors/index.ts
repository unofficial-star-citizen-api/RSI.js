import { RSINotFoundError } from '@/errors';

/**
 * Thrown when no organization exists for the requested SID.
 *
 * @category Errors
 *
 * @example
 * ```typescript
 * import { RSI, RSIOrganizationNotFoundError } from '@unofficial-star-citizen-api/rsi.js';
 *
 * const rsi = new RSI();
 *
 * try {
 *   await rsi.organizations.get('NOTANORG');
 * } catch (error) {
 *   if (error instanceof RSIOrganizationNotFoundError)
 *     console.log('No such organization');
 * }
 * ```
 */
export class RSIOrganizationNotFoundError extends RSINotFoundError
{
  /**
   * @param sid - The organization SID that was not found
   */
  constructor(sid: string)
  {
    super('Organization', sid);
    this.name = 'RSIOrganizationNotFoundError';
  }
}
