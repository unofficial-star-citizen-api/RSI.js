import { RSIError } from '@/errors';
import { HttpClient } from '@/http-client';
import { RSIShipSearch } from '../interfaces';

/**
 * A ship as returned by the ship matrix, before store data is merged in.
 * @hidden
 */
export type RSIShipMatrixDto = Omit<RSIShipSearch, 'meta' | 'price' | 'purchasable'> & {
  readonly url: string;
};

/**
 * Filters accepted by the ship matrix. RSI ignores every other parameter.
 * @hidden
 */
export interface RSIShipMatrixFilters
{
  id?: string;
  chassis_id?: string;
}

/**
 * Reads ship specs from the RSI ship matrix.
 * @hidden
 */
export class ShipMatrixHelper
{
  private static readonly url = 'https://robertsspaceindustries.com/ship-matrix/index';

  /**
   * Fetch ships from the ship matrix. Without filters, the whole ship matrix is returned (several MB).
   * @param httpClient - HTTP client to use
   * @param filters - `id` or `chassis_id` filter
   * @returns The matching ships; empty when none match
   */
  public static async fetch(httpClient: HttpClient, filters: RSIShipMatrixFilters = {}): Promise<RSIShipMatrixDto[]>
  {
    const request = await httpClient.post<{
      success: number;
      data?: RSIShipMatrixDto[];
    }>(ShipMatrixHelper.url, filters);

    if (request === null)
    {
      throw new RSIError('Failed to retrieve ship data. Request returned null.');
    }
    else if (request.status !== 200)
    {
      throw new RSIError(`Failed to retrieve ship data. Status code: ${request.status}`);
    }
    else if (request.data.success !== 1)
    {
      throw new RSIError('Failed to retrieve ship data. Response indicates failure.');
    }

    return request.data.data ?? [];
  }
}
