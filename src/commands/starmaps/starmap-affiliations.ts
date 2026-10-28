import { HttpClient } from '@/http-client';
import { RSIError } from '@/errors';
import { createLogger } from '@/logger';
import { StarMapHelper } from './helpers/starmap.helper';
import { RSIStarMapObjectAffiliation } from './interfaces';

/**
 * StarmapAffiliations class for retrieving Star Citizen starmap affiliations
 */
export class StarmapAffiliations
{
  private readonly httpClient: HttpClient;
  private readonly logger = createLogger(StarmapAffiliations.name);

  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  public async getAll(name?: string): Promise<RSIStarMapObjectAffiliation[] | null>
  {
    this.logger.info('Fetching starmap affiliations', { name });

    const affiliations = await StarMapHelper.getStarmapData(this.httpClient, 'affiliations');
    if (affiliations === null)
      throw new RSIError('Failed to retrieve starmap affiliations data');

    if (name === undefined)
    {
      return affiliations;
    }

    const res = affiliations.filter(s => s.name === name || s.code === name);

    return res.length > 0 ? res : null;
  }
}
