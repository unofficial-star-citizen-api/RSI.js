import { HttpClient } from '@/http-client';
import { StarMapHelper } from './helpers/starmap.helper';
import { RSIStarmapStarSystem } from './interfaces/star-system.interface';

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

  public async getAll(): Promise<RSIStarmapStarSystem[] | null>
  {
    const systems = await StarMapHelper.getStarmapData<RSIStarmapStarSystem>(this.httpClient, 'systems');
    if (systems === null)
    {
      return null;
    }

    return systems;
  }
}
