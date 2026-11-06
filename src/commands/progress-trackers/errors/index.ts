import { RSINotFoundError } from '@/errors';

/**
 * Thrown when no progress tracker team exists for the requested slug.
 *
 * @category Errors
 *
 * @example
 * ```typescript
 * import { RSI, RSIProgressTrackerTeamNotFoundError } from '@unofficial-star-citizen-api/rsi.js';
 *
 * const rsi = new RSI();
 *
 * try {
 *   await rsi.progressTrackers.getTeamBySlug('not-a-team');
 * } catch (error) {
 *   if (error instanceof RSIProgressTrackerTeamNotFoundError)
 *     console.log('No such team');
 * }
 * ```
 */
export class RSIProgressTrackerTeamNotFoundError extends RSINotFoundError
{
  /**
   * @param slug - The team slug that was not found
   */
  constructor(slug: string)
  {
    super('Progress tracker team', slug);
    this.name = 'RSIProgressTrackerTeamNotFoundError';
  }
}
