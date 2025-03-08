import { HttpClient } from '../../http-client';
import { TunnelInterface } from './interfaces/tunnel.interface';
import { StarMapHelper } from './helpers/starmap.helper'

/**
 * StarmapTunnels class for retrieving Star Citizen starmap tunnels
 */
export class StarmapTunnels {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public async find(tunnelId?: string): Promise<TunnelInterface[] | null> {
    const tunnels = await StarMapHelper.getStarmapData<TunnelInterface>(this.httpClient, "tunnels");
    if (tunnels === null) {
      return null;
    }

    if (tunnelId === undefined) {
      return tunnels;
    }

    const res = tunnels.filter(s => String(s.id).toLowerCase() === String(tunnelId).toLowerCase());

    return res.length > 0 ? res : null;
  }
}
