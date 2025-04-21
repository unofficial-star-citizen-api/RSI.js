import { HttpClient } from '../../http-client';
import { StarMapHelper } from './helpers/starmap.helper';
import { RSIStarSystemInterface } from './interfaces/star-system.interface';

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

  public async find(name?: string): Promise<RSIStarSystemInterface[] | null>
  {
    const systems = await StarMapHelper.getStarmapData<RSIStarSystemInterface>(this.httpClient, 'systems');
    if (systems === null)
    {
      return null;
    }

    if (name === undefined)
    {
      return systems;
    }

    const res = systems.filter(s => String(s.name).toLowerCase() === String(name).toLowerCase());

    return res.length > 0 ? res : null;
  }
}
