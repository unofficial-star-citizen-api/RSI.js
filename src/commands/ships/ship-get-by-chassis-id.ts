import { HttpClient } from '@/http-client';
import { createLogger } from '@/logger';
import {
  ShipHelper, ShipMatrixHelper, ShipStoreHelper
} from './helpers';
import { RSIShipChassisNotFoundError } from './errors';
import { RSIShipSearch } from './interfaces';

type ReturnFunction = (chassisId: number) => Promise<RSIShipSearch[]>;

/**
 * Build the function behind {@link Ships.getByChassisId}. Use `rsi.ships.getByChassisId` instead.
 * @hidden
 */
export function getByChassisId(httpClient: HttpClient, loggerName = 'Ships'): ReturnFunction
{
  const logger = createLogger(loggerName);

  return async function (chassisId: number): Promise<RSIShipSearch[]>
  {
    logger.info('Fetching ships by chassis', { chassisId });
    ShipHelper.assertPositiveInteger(chassisId, 'Chassis ID');

    const ships = await ShipMatrixHelper.fetch(httpClient, { chassis_id: String(chassisId) });
    if (ships.length === 0)
    {
      throw new RSIShipChassisNotFoundError(chassisId);
    }

    const prices = await ShipStoreHelper.fetchPrices(httpClient, { chassisId });
    return ships.map(ship => ShipHelper.toShipSearch(ship, prices));
  };
}
