import { RSIError } from '@/errors';
import { HttpClient } from '@/http-client';
import { ShipHelper } from './ship.helper';

/**
 * Store data of a ship, as returned by the store GraphQL search.
 * @hidden
 */
export interface RSIShipStoreDto
{
  readonly id: string;
  /** Store price in cents */
  readonly msrp: number | null;
  readonly purchasable: boolean;
}

interface RSIShipStoreResponse
{
  data?: {
    store?: {
      search?: {
        totalCount: number;
        resources: RSIShipStoreDto[] | null;
      } | null;
    } | null;
  };
  errors?: unknown[];
}

/**
 * Reads ship prices from the RSI pledge store GraphQL API.
 * @hidden
 */
export class ShipStoreHelper
{
  private static readonly url = 'https://robertsspaceindustries.com/graphql';
  /** Maximum page size accepted by the store GraphQL search */
  private static readonly pageSize = 30;
  /** Number of store pages fetched concurrently */
  private static readonly pageConcurrency = 5;

  /**
   * Fetch store prices, keyed by ship ID. Without a chassis, every store page is read.
   * @param httpClient - HTTP client to use
   * @param filters - Optional chassis filter
   * @returns Store data keyed by ship ID
   */
  public static async fetchPrices(httpClient: HttpClient, filters: { chassisId?: number; } = {}): Promise<Map<string, RSIShipStoreDto>>
  {
    const ships = filters.chassisId === undefined ? { all: true } : { chassisId: filters.chassisId };

    const first = await ShipStoreHelper.fetchPage(httpClient, ships, 1);
    const pageCount = Math.ceil(first.totalCount / ShipStoreHelper.pageSize);

    const pages = Array.from({ length: Math.max(pageCount - 1, 0) }, (_, i) => i + 2);
    const rest = await ShipHelper.mapWithConcurrency(pages, ShipStoreHelper.pageConcurrency, p => ShipStoreHelper.fetchPage(httpClient, ships, p));

    const resources = [first, ...rest].flatMap(result => result.resources);
    return new Map(resources.map(resource => [String(resource.id), resource]));
  }

  /**
   * Fetch one page of the store GraphQL ship search
   * @param httpClient - HTTP client to use
   * @param ships - Ship search input
   * @param page - Page number, starting at 1
   * @returns The page resources and the total number of matches
   */
  private static async fetchPage(httpClient: HttpClient, ships: Record<string, unknown>, page: number): Promise<{ resources: RSIShipStoreDto[]; totalCount: number; }>
  {
    const response = await httpClient.post<RSIShipStoreResponse>(ShipStoreHelper.url, {
      operationName: 'GetShipList',
      query: `query GetShipList($query: SearchQuery!, $storeFront: String = "pledge") {
          store(name: $storeFront, browse: true) {
            search(query: $query) {
              totalCount
              resources {
                ... on RSIShip {
                  id
                  msrp
                  purchasable
                }
              }
            }
          }
        }`,
      variables: {
        query: {
          page,
          limit: ShipStoreHelper.pageSize,
          // A stable sort is required, the default order repeats ships across pages
          sort: { field: 'name', direction: 'asc' },
          ships
        }
      }
    });

    if (response === null || response.status !== 200)
    {
      throw new RSIError(`Failed to retrieve ship prices. Status code: ${response?.status}`);
    }

    if (response.data.errors && response.data.errors.length > 0)
    {
      throw new RSIError(`Failed to retrieve ship prices. API returned errors: ${JSON.stringify(response.data.errors)}`);
    }

    const search = response.data.data?.store?.search;
    if (!search)
    {
      throw new RSIError('Failed to retrieve ship prices. API returned no data.');
    }

    return { resources: search.resources ?? [], totalCount: search.totalCount };
  }
}
