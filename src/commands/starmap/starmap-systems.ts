import { HttpClient } from '../../http-client';
import { StarSystemInterface } from './interfaces/star-system.interface';
import { StarMapHelper } from './helpers/starmap.helper';

/**
 * StarmapSystems class for retrieving Star Citizen starmap systems
 */
export class StarmapSystems {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public async find(name?: string): Promise<StarSystemInterface[] | null> {
    const systems = await StarMapHelper.getStarmapData<StarSystemInterface>(this.httpClient, 'systems');
    if (systems === null) {
      return null;
    }

    if (name === undefined) {
      return systems;
    }

    const res = systems.filter(s => String(s.name).toLowerCase() === String(name).toLowerCase());

    return res.length > 0 ? res : null;
  }
}
