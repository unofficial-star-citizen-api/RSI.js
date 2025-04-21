import { HttpClient } from '../../http-client';
import { RSIStarSystemDetailInterface } from './interfaces/star-system-detail.interface';

/**
 * StarmapStarSystems class for retrieving Star Citizen starmap star systems
 */
export class StarmapStarSystems
{
  private readonly urlStarSystem = 'https://robertsspaceindustries.com/api/starmap/star-systems/{0}';
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  async find(code: string): Promise<RSIStarSystemDetailInterface | null>
  {
    const req = await this.httpClient.post<{
      success: number;
      data?: { resultset: RSIStarSystemDetailInterface; };
    }>(this.urlStarSystem.replace('{0}', code));

    if (req === null || req.status !== 200)
    {
      return null;
    }

    const resp = req.data;

    // Check response
    if (resp.success !== 1 || !resp.data)
    {
      return null;
    }

    return resp.data.resultset;
  }
}
