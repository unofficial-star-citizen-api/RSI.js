import { HttpClient } from '../../http-client';
import { SearchResultInterface } from './interfaces/search-result.interface';

/**
 * StarmapSearch class for searching Star Citizen starmap
 */
export class StarmapSearch {
  private readonly urlFind = "https://robertsspaceindustries.com/api/starmap/find";
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public async search(searchPattern: string): Promise<SearchResultInterface | null> {
    const data = {
      query: searchPattern
    };

    const req = await this.httpClient.post<{
      success: number;
      data?: {
        systems: { resultset: Array<Record<string, unknown>> };
        objects: { resultset: Array<Record<string, unknown>> }
      };
    }>(this.urlFind, data);

    if (req === null || req.status !== 200) {
      return null;
    }

    const resp = req.data;

    // Check response
    if (resp.success !== 1 || !resp.data) {
      return null;
    }

    return {
      systems: resp.data.systems.resultset,
      objects: resp.data.objects.resultset
    };
  }
}
