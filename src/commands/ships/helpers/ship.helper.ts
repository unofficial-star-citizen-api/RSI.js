import { RSIError } from '@/errors';
import { HttpClient } from '@/http-client';
import { RSIShipSearch } from '../interfaces';
import type { RSIShipMatrixDto } from './ship-matrix.helper';
import type { RSIShipStoreDto } from './ship-store.helper';

/**
 * Shared mapping and utilities of the ship commands.
 * @hidden
 */
export class ShipHelper
{
  /**
   * Merge ship-matrix specs with store data
   * @param ship - Ship-matrix ship
   * @param prices - Store data keyed by ship ID
   * @returns The public ship
   */
  public static toShipSearch(ship: RSIShipMatrixDto, prices: Map<string, RSIShipStoreDto>): RSIShipSearch
  {
    const {
      url,
      ...data
    } = ship;
    const store = prices.get(String(ship.id));
    return {
      ...data,
      meta: {
        url: HttpClient.toAbsoluteUrl(url)
      },
      price: (store?.msrp ?? 0) / 100,
      purchasable: store?.purchasable ?? false
    };
  }

  /**
   * Throw if a value is not a positive integer
   * @param value - Value to check
   * @param label - Name of the value, used in the error message
   */
  public static assertPositiveInteger(value: number, label: string): void
  {
    if (!Number.isInteger(value) || value <= 0)
    {
      throw new RSIError(`${label} must be a positive integer. Received: ${value}`);
    }
  }

  /**
   * Map items through an async function with a bounded number of concurrent calls, preserving order
   * @param items - Items to map
   * @param limit - Maximum number of concurrent calls
   * @param fn - Async mapping function
   * @returns Mapped results in input order
   */
  public static async mapWithConcurrency<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]>
  {
    const results = new Array<R>(items.length);
    let next = 0;

    const worker = async (): Promise<void> =>
    {
      while (next < items.length)
      {
        const index = next++;
        results[index] = await fn(items[index]);
      }
    };

    await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
    return results;
  }
}
