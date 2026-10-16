import { HttpClient } from '@/http-client';
import { RSIError } from '@/errors';
import { RSIStarMapObject, RSIStarMapObjectData } from '../interfaces';

type StarmapField = keyof Omit<RSIStarMapObjectData, 'config'>;

export class StarMapHelper
{
  public static async getStarmapData<T extends StarmapField>(httpClient: HttpClient, field: T): Promise<RSIStarMapObjectData[T]['resultset'] | null>
  {
    const url = 'https://robertsspaceindustries.com/api/starmap/bootup';

    const req = await httpClient.post<RSIStarMapObject>(url);

    if (req === null || req.status !== 200)
      throw new RSIError(`Failed to retrieve starmap data from ${url}`);

    const resp = req.data;

    if (resp.success !== 1 || !resp.data)
      throw new RSIError(`Starmap data retrieval failed with code: ${resp.code}, message: ${resp.msg}`);

    return resp.data[field]?.resultset ?? null;
  }
}