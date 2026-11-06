import { RSINotFoundError } from '@/errors';

/**
 * Thrown when no ship exists for the requested ship-matrix ID.
 *
 * @category Errors
 *
 * @example
 * ```typescript
 * import { RSI, RSIShipNotFoundError } from '@unofficial-star-citizen-api/rsi.js';
 *
 * const rsi = new RSI();
 *
 * try {
 *   await rsi.ships.getById(999999);
 * } catch (error) {
 *   if (error instanceof RSIShipNotFoundError)
 *     console.log('No such ship');
 * }
 * ```
 */
export class RSIShipNotFoundError extends RSINotFoundError
{
  /**
   * @param id - The ship-matrix ID that was not found
   */
  constructor(id: number)
  {
    super('Ship', id);
    this.name = 'RSIShipNotFoundError';
  }
}

/**
 * Thrown when no ship exists for the requested chassis ID.
 *
 * @category Errors
 *
 * @example
 * ```typescript
 * import { RSI, RSIShipChassisNotFoundError } from '@unofficial-star-citizen-api/rsi.js';
 *
 * const rsi = new RSI();
 *
 * try {
 *   await rsi.ships.getByChassisId(999999);
 * } catch (error) {
 *   if (error instanceof RSIShipChassisNotFoundError)
 *     console.log('No such chassis');
 * }
 * ```
 */
export class RSIShipChassisNotFoundError extends RSINotFoundError
{
  /**
   * @param chassisId - The chassis ID that was not found
   */
  constructor(chassisId: number)
  {
    super('Ship chassis', chassisId);
    this.name = 'RSIShipChassisNotFoundError';
  }
}
