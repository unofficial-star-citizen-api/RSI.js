import { HttpClient } from '@/http-client';
import { StarMapHelper } from './helpers/starmap.helper';
import { RSITunnelInterface } from './interfaces/tunnel.interface';

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

  public async getAll(): Promise<RSITunnelInterface[] | null>
  {
    const tunnels = await StarMapHelper.getStarmapData<RSITunnelInterface>(this.httpClient, 'tunnels');
    if (tunnels === null)
    {
      return null;
    }

    return tunnels;
  }
}
