import { HttpClient } from '@/http-client';
import
{
  RSIStarMapSearch,
  RSIStarMapSearchResult
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

  public async search(searchPattern: string): Promise<RSIStarMapSearch | null>
  {
    const data = { query: searchPattern };

    const req = await this.httpClient.post<RSIStarMapSearchResult>(this.urlFind, data);
    if (req === null || req.status !== 200)
      throw new Error(`Failed to retrieve starmap search data from ${this.urlFind}`);

    const resp = req.data;

    // Check response
    if (resp.success !== 1 || !resp.data)
      throw new Error(`Starmap search data retrieval failed with code: ${resp.code}, message: ${resp.msg}`);

    return {
      systems: resp.data.systems.resultset,
      objects: resp.data.objects.resultset
    };
  }
}
