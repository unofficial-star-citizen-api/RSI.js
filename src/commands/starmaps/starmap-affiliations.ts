import { HttpClient } from '@/http-client';
import { StarMapHelper } from './helpers/starmap.helper';
import { RSIStarMapObjectAffiliationElement } from './interfaces';

/**
 * StarmapAffiliations class for retrieving Star Citizen starmap affiliations
 */
export class StarmapAffiliations
{
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  public async getAll(name?: string): Promise<RSIStarMapObjectAffiliationElement[] | null>
  {
    const affiliations = await StarMapHelper.getStarmapData(this.httpClient, 'affiliations');
    if (affiliations === null)
    {
      return null;
    }

    if (name === undefined)
    {
      return affiliations;
    }

    const res = affiliations.filter(s => s.name === name || s.code === name);

    return res.length > 0 ? res : null;
  }
}
