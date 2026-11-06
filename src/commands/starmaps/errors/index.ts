import { RSINotFoundError } from '@/errors';

/**
 * Thrown when no star system exists for the requested code.
 *
 * @category Errors
 *
 * @example
 * ```typescript
 * import { RSI, RSIStarSystemNotFoundError } from '@unofficial-star-citizen-api/rsi.js';
 *
 * const rsi = new RSI();
 *
 * try {
 *   await rsi.starmaps.getStarSystemByCode('NOTASYSTEM');
 * } catch (error) {
 *   if (error instanceof RSIStarSystemNotFoundError)
 *     console.log('No such star system');
 * }
 * ```
 */
export class RSIStarSystemNotFoundError extends RSINotFoundError
{
  /**
   * @param code - The star system code that was not found
   */
  constructor(code: string)
  {
    super('Star system', code);
    this.name = 'RSIStarSystemNotFoundError';
  }
}

/**
 * Thrown when no celestial object exists for the requested code.
 *
 * @category Errors
 *
 * @example
 * ```typescript
 * import { RSI, RSICelestialObjectNotFoundError } from '@unofficial-star-citizen-api/rsi.js';
 *
 * const rsi = new RSI();
 *
 * try {
 *   await rsi.starmaps.getCelestialObjectByCode('NOT.AN.OBJECT');
 * } catch (error) {
 *   if (error instanceof RSICelestialObjectNotFoundError)
 *     console.log('No such celestial object');
 * }
 * ```
 */
export class RSICelestialObjectNotFoundError extends RSINotFoundError
{
  /**
   * @param code - The celestial object code that was not found
   */
  constructor(code: string)
  {
    super('Celestial object', code);
    this.name = 'RSICelestialObjectNotFoundError';
  }
}
