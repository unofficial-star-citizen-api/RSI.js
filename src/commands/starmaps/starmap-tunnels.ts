import { HttpClient } from '@/http-client';
import { StarMapHelper } from './helpers/starmap.helper';
import { RSIStarMapObjectTunnelsResultset } from './interfaces';

/**
 * StarmapTunnels class for retrieving Star Citizen starmap tunnels
 */
export class StarmapTunnels
{
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  public async getAll(): Promise<RSIStarMapObjectTunnelsResultset[] | null>
  {
    const tunnels = await StarMapHelper.getStarmapData(this.httpClient, 'tunnels');
    if (tunnels === null)
    {
      return null;
    }

    return tunnels;
  }
}
