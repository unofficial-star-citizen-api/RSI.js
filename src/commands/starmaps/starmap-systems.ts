import { HttpClient } from '@/http-client';
import { StarMapHelper } from './helpers/starmap.helper';
import { RSIStarMapObjectSystem } from './interfaces';

/**
 * StarmapSystems class for retrieving Star Citizen starmap systems
 */
export class StarmapSystems
{
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  public async getAll(): Promise<RSIStarMapObjectSystem[] | null>
  {
    const systems = await StarMapHelper.getStarmapData(this.httpClient, 'systems');
    if (systems === null)
    {
      return null;
    }

    return systems;
  }
}
