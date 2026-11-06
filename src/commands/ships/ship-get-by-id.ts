import { HttpClient } from '@/http-client';
import { createLogger } from '@/logger';
import
{
  ShipHelper, ShipMatrixHelper, ShipStoreHelper
} from './helpers';
import { RSIShipNotFoundError } from './errors';
import { RSIShipSearch } from './interfaces';

type ReturnFunction = (id: number) => Promise<RSIShipSearch>;

/**
 * Build the function behind {@link Ships.getById}. Use `rsi.ships.getById` instead.
 * @hidden
 */
export function getById(httpClient: HttpClient, loggerName = 'Ships'): ReturnFunction
{
  const logger = createLogger(loggerName);

  return async function (id: number): Promise<RSIShipSearch>
  {
    logger.info('Fetching ship', { id });
    ShipHelper.assertPositiveInteger(id, 'Ship ID');

    const [ship] = await ShipMatrixHelper.fetch(httpClient, { id: String(id) });
    if (!ship)
    {
      throw new RSIShipNotFoundError(id);
    }

    // The store cannot filter by ship ID, so price the whole chassis and pick the ship
    const prices = await ShipStoreHelper.fetchPrices(httpClient, { chassisId: ship.chassis_id });
    return ShipHelper.toShipSearch(ship, prices);
  };
}
