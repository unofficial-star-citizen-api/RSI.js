import { HttpClient } from '@/http-client';
import { StarMapHelper } from './helpers/starmap.helper';
import { RSIStarMapObjectSystem } from './interfaces';
import { createLogger } from '@/logger';

/**
 * StarmapSystems class for retrieving Star Citizen starmap systems
 */
export class StarmapSystems
{
  private readonly httpClient: HttpClient;
  private readonly logger = createLogger(StarmapSystems.name);

  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  public async getAll(): Promise<RSIStarMapObjectSystem[] | null>
  {
    this.logger.info('Fetching starmap systems');

    const systems = await StarMapHelper.getStarmapData(this.httpClient, 'systems');
    return systems;
  }
}
