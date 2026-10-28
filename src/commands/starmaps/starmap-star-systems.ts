import { HttpClient } from '@/http-client';
import { RSIError } from '@/errors';
import { createLogger } from '@/logger';
import { RSIStarMapStarSystem } from './interfaces/star-system.interface';

/**
 * StarmapStarSystems class for retrieving Star Citizen starmap star systems
 */
export class StarmapStarSystems
{
  private readonly urlStarSystem = 'https://robertsspaceindustries.com/api/starmap/star-systems/{0}';
  private readonly httpClient: HttpClient;
  private readonly logger = createLogger(StarmapStarSystems.name);

  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  async getByCode(code: string): Promise<RSIStarMapStarSystem | null>
  {
    this.logger.info('Fetching starmap star system', { code });

    const req = await this.httpClient.post<RSIStarMapStarSystem>(this.urlStarSystem.replace('{0}', code));
    if (req === null || req.status !== 200)
      throw new RSIError(`Failed to retrieve star system data from ${this.urlStarSystem.replace('{0}', code)}`);

    const resp = req.data;
    if (resp.success !== 1 || !resp.data)
      throw new RSIError(`Star system data retrieval failed with code: ${resp.code}, message: ${resp.msg}`);

    return resp.data.resultset.at(0) ?? null;
  }
}
