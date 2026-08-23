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

  async getByCode(objectCode: string): Promise<RSIStarmapCelestialObject | null>
  {
    const req = await this.httpClient.post<{
      success: number;
      data?: { resultset: RSIStarmapCelestialObject; };
    }>(this.urlCelestial.replace('{0}', objectCode));

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
