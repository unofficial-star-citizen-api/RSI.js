import { HttpClient } from '@/http-client';
import { createLogger } from '@/logger';
import {
  ShipHelper, ShipMatrixHelper, ShipStoreHelper
} from './helpers';
import { RSIShipSearch } from './interfaces';

type ReturnFunction = () => Promise<RSIShipSearch[]>;

/**
 * Build the function behind {@link Ships.getAll}. Use `rsi.ships.getAll` instead.
 * @hidden
 */
export function getAll(httpClient: HttpClient, loggerName = 'Ships'): ReturnFunction
{
  const logger = createLogger(loggerName);

  return async function (): Promise<RSIShipSearch[]>
  {
    logger.info('Fetching all ships');

    const [ships, prices] = await Promise.all([
      ShipMatrixHelper.fetch(httpClient),
      ShipStoreHelper.fetchPrices(httpClient)
    ]);

    return ships.map(ship => ShipHelper.toShipSearch(ship, prices));
  };
}
