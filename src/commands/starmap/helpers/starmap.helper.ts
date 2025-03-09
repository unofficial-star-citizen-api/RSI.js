import { HttpClient } from 'src/http-client';

export class StarMapHelper {
  public static async getStarmapData<T>(httpClient: HttpClient, field: string): Promise<T[] | null> {
    const url = 'https://robertsspaceindustries.com/api/starmap/bootup';

    const req = await httpClient.post<{
      success: number;
      data?: Record<string, { resultset: T[] }>;
    }>(url);

    if (req === null || req.status !== 200) {
      return null;
    }

    const resp = req.data;

    if (resp.success !== 1 || !resp.data) {
      return null;
    }

    return resp.data[field]?.resultset || null;
  }
}