import { HttpClient } from '@/http-client';
import { RSIStarmapCelestialObject } from './interfaces/celestial-object.interface';

/**
 * StarmapCelestialObjects class for retrieving Star Citizen celestial objects
 */
export class StarmapCelestialObjects
{
  private readonly urlCelestial = 'https://robertsspaceindustries.com/api/starmap/celestial-objects/{0}';
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  async getAll(): Promise<RSIStarmapCelestialObject[] | null>
  {
    const req = await this.httpClient.post<RSIStarmapCelestialObject>(this.urlCelestial.replace('{0}', ''));
    if (req === null || req.status !== 200)
      throw new Error(`Failed to retrieve celestial objects data from ${this.urlCelestial.replace('{0}', '')}`);

    const resp = req.data;
    if (resp.success !== 1 || !resp.data)
      throw new Error(`Celestial objects data retrieval failed with code: ${resp.code}, message: ${resp.msg}`);

    return resp.data.resultset;
  }

  async getByCode(objectCode: string): Promise<RSIStarmapCelestialObject | null>
  {
    const req = await this.httpClient.post<{
      success: number;
      data?: { resultset: RSIStarmapCelestialObject; };
    }>(this.urlCelestial.replace('{0}', objectCode));

    if (req === null || req.status !== 200)
      throw new Error(`Failed to retrieve celestial object data from ${this.urlCelestial.replace('{0}', objectCode)}`);

    const resp = req.data;

    // Check response
    if (resp.success !== 1 || !resp.data)
      throw new Error(`Celestial object data retrieval failed with success: ${resp.success}, data: ${resp.data}`);

    return resp.data.resultset;
  }
}
