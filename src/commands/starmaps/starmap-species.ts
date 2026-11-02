import { HttpClient } from '@/http-client';
import { StarMapHelper } from './helpers/starmap.helper';
import { RSIStarMapObjectSpecies } from './interfaces';
import { createLogger } from '@/logger';

/**
 * StarmapSpecies class for retrieving Star Citizen starmap species
 * Use {@link Starmaps} through `rsi.starmaps` instead.
 * @hidden
 */
export class StarmapSpecies
{
  private readonly httpClient: HttpClient;
  private readonly logger = createLogger(StarmapSpecies.name);

  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  public async getAll(): Promise<RSIStarMapObjectSpecies[] | null>
  {
    this.logger.info('Fetching starmap species');

    const species = await StarMapHelper.getStarmapData(this.httpClient, 'species');
    return species;
  }
}
