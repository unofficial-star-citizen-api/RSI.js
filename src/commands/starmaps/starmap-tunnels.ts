import { HttpClient } from '@/http-client';
import { StarMapHelper } from './helpers/starmap.helper';
import { RSIStarMapObjectTunnel } from './interfaces';
import { createLogger } from '@/logger';

/**
 * StarmapTunnels class for retrieving Star Citizen starmap tunnels
 */
export class StarmapTunnels
{
  private readonly httpClient: HttpClient;
  private readonly logger = createLogger(StarmapTunnels.name);

  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  public async getAll(): Promise<RSIStarMapObjectTunnel[] | null>
  {
    this.logger.info('Fetching starmap tunnels');

    const tunnels = await StarMapHelper.getStarmapData(this.httpClient, 'tunnels');
    return tunnels;
  }
}
