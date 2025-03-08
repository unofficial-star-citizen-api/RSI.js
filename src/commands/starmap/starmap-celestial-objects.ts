import { HttpClient } from '../../http-client';
import { CelestialObjectInterface } from './interfaces/celestial-object.interface';

/**
 * StarmapCelestialObjects class for retrieving Star Citizen celestial objects
 */
export class StarmapCelestialObjects {
  private readonly urlCelestial = "https://robertsspaceindustries.com/api/starmap/celestial-objects/{0}";
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async find(code: string): Promise<CelestialObjectInterface | null> {
    const req = await this.httpClient.post<{
      success: number;
      data?: { resultset: CelestialObjectInterface };
    }>(this.urlCelestial.replace('{0}', code));

    if (req === null || req.status !== 200) {
      return null;
    }

    const resp = req.data;

    // Check response
    if (resp.success !== 1 || !resp.data) {
      return null;
    }

    return resp.data.resultset;
  }
}
