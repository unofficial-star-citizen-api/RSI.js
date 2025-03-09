import { HttpClient } from '../../http-client';
import { RouteResultInterface } from './interfaces/route-result.interface';

/**
 * StarmapRouteSearch class for searching routes in Star Citizen starmap
 */
export class StarmapRoute {
  private readonly urlFind = 'https://robertsspaceindustries.com/api/starmap/routes/find';
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async find(from: string, to: string, shipSize: string): Promise<RouteResultInterface | null> {
    const data = {
      departure: from,
      destination: to,
      ship_size: shipSize
    };

    const req = await this.httpClient.post<{
      success: number;
      data?: {
        shortest: Array<Record<string, unknown>>;
        leastjumps: Array<Record<string, unknown>>;
      };
    }>(this.urlFind, data);

    if (req === null || req.status !== 200) {
      return null;
    }

    const resp = req.data;

    // Check response
    if (resp.success !== 1 || !resp.data) {
      return null;
    }

    return {
      shortest: resp.data.shortest,
      leastjumps: resp.data.leastjumps
    };
  }
}
