import { HttpClient } from '@/http-client';
import { StarMapHelper } from './helpers/starmap.helper';
import { RSIStarMapObjectSpecies } from './interfaces';

/**
 * StarmapSpecies class for retrieving Star Citizen starmap species
 */
export class StarmapSpecies
{
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  public async getAll(): Promise<RSIStarMapObjectSpecies[] | null>
  {
    const species = await StarMapHelper.getStarmapData(this.httpClient, 'species');
    if (species === null)
    {
      return null;
    }

    return species;
  }
}
