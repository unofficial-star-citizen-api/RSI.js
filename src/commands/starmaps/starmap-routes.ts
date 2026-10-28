import { HttpClient } from '@/http-client';
import { RSIError } from '@/errors';
import { createLogger } from '@/logger';
import { RSIStarmapRouteShipSize } from './interfaces';
import { RSIStarmapRoute } from './interfaces/route.interface';

/**
 * StarmapRouteSearch class for searching routes in Star Citizen starmap
 */
export class StarmapRoute
{
  private readonly urlFind = 'https://robertsspaceindustries.com/api/starmap/routes/find';
  private readonly httpClient: HttpClient;
  private readonly logger = createLogger(StarmapRoute.name);

  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  async findRoutes(from: string, to: string, shipSize: RSIStarmapRouteShipSize): Promise<RSIStarmapRoute | null>
  {
    this.logger.info('Finding starmap routes', {
      from,
      to,
      shipSize
    });

    const data = {
      departure: from,
      destination: to,
      ship_size: shipSize
    };

    const req = await this.httpClient.post<{
      success: number;
      data?: RSIStarmapRoute;
    }>(this.urlFind, data);

    if (req === null || req.status !== 200)
      throw new RSIError(`Failed to retrieve starmap route data from ${this.urlFind}`);

    const resp = req.data;

    // Check response
    if (resp.success !== 1 || !resp.data)
      throw new RSIError(`Starmap route data retrieval failed with success: ${resp.success}, data: ${resp.data}`);

    return {
      shortest: resp.data.shortest,
      leastjumps: resp.data.leastjumps
    };
  }
}
