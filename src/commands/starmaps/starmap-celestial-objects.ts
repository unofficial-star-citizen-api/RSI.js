import { HttpClient } from '@/http-client';
import { RSIError } from '@/errors';
import { createLogger } from '@/logger';
import { RSICelestialObjectNotFoundError } from './errors';
import { RSIStarmapCelestialObject, RSIStarmapCelestialObjectResponse } from './interfaces/celestial-object.interface';

/**
 * StarmapCelestialObjects class for retrieving Star Citizen celestial objects
 * Use {@link Starmaps} through `rsi.starmaps` instead.
 * @hidden
 */
export class StarmapCelestialObjects
{
  private readonly urlCelestial = 'https://robertsspaceindustries.com/api/starmap/celestial-objects/{0}';
  private readonly httpClient: HttpClient;
  private readonly logger = createLogger(StarmapCelestialObjects.name);

  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  async getAll(): Promise<RSIStarmapCelestialObject[] | null>
  {
    this.logger.info('Fetching starmap celestial objects');

    const req = await this.httpClient.post<RSIStarmapCelestialObjectResponse>(this.urlCelestial.replace('{0}', ''));
    if (req === null || req.status !== 200)
      throw new RSIError(`Failed to retrieve celestial objects data from ${this.urlCelestial.replace('{0}', '')}`);

    const resp = req.data;
    if (resp.success !== 1 || !resp.data)
      throw new RSIError(`Celestial objects data retrieval failed with code: ${resp.code}, message: ${resp.msg}`);

    return resp.data.resultset;
  }

  async getByCode(objectCode: string): Promise<RSIStarmapCelestialObject>
  {
    this.logger.info('Fetching starmap celestial object', { objectCode });

    const req = await this.httpClient.post<{
      success: number;
      data?: { resultset: RSIStarmapCelestialObject | RSIStarmapCelestialObject[]; };
    }>(this.urlCelestial.replace('{0}', objectCode));

    if (req === null || req.status !== 200)
      throw new RSIError(`Failed to retrieve celestial object data from ${this.urlCelestial.replace('{0}', objectCode)}`);

    const resp = req.data;

    // Check response
    if (resp.success !== 1 || !resp.data)
      throw new RSIError(`Celestial object data retrieval failed with success: ${resp.success}, data: ${resp.data}`);

    // RSI answers an unknown code with an empty list instead of a single object
    const celestialObject = resp.data.resultset;
    if (Array.isArray(celestialObject))
    {
      if (celestialObject.length === 0)
        throw new RSICelestialObjectNotFoundError(objectCode);

      return celestialObject[0];
    }

    return celestialObject;
  }
}
