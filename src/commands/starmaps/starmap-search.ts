import { HttpClient } from '@/http-client';
import
{
  RSIStarMapSearchResult,
  RSIStarMapSearchResultObjectsResultset,
  RSIStarMapSearchResultStarSystemElement
} from './interfaces/system.interface';

/**
 * StarmapSearch class for searching Star Citizen starmap
 */
export class StarmapSearch
{
  private readonly urlFind = 'https://robertsspaceindustries.com/api/starmap/find';
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  public async search(searchPattern: string): Promise<{ systems: RSIStarMapSearchResultStarSystemElement[], objects: RSIStarMapSearchResultObjectsResultset[]; } | null>
  {
    const data = { query: searchPattern };

    const req = await this.httpClient.post<RSIStarMapSearchResult>(this.urlFind, data);

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

    return {
      systems: resp.data.systems.resultset,
      objects: resp.data.objects.resultset
    };
  }
}
