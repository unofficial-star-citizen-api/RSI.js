import { RSIError } from '@/errors';
import { HttpClient } from '@/http-client';
import { createLogger } from '@/logger';
import { load } from 'cheerio';
import { HttpHelper } from '../../helpers/http.helper';
import {
  ShipHelper, ShipMatrixHelper, ShipStoreHelper
} from './helpers';
import { RSIShipSearch, RSIShipSearchParams } from './interfaces';

type ReturnFunction = (searchArgs: RSIShipSearchParams) => Promise<RSIShipSearch[]>;

/**
 * Build the function behind {@link Ships.search}. Use `rsi.ships.search` instead.
 * @hidden
 */
export function search(httpClient: HttpClient, loggerName = 'Ships'): ReturnFunction
{
  const urlSearchShips = 'https://robertsspaceindustries.com/api/store/getShips';
  const logger = createLogger(loggerName);
  /** Number of search pages fetched concurrently */
  const pageBatchSize = 5;
  /** Maximum number of ship details fetched concurrently, bounds peak memory */
  const shipConcurrency = 5;

  /**
   * Fetch a single search page and extract its ship IDs
   * @param data - Search payload including the page number
   * @returns Ship IDs of the page and the page row count
   */
  async function searchPage(data: Record<string, unknown>): Promise<{ shipIds: string[]; rowcount: number; }>
  {
    const req = await httpClient.post<{
      success: number;
      data: {
        html: string;
        rowcount: number;
      };
    }>(urlSearchShips, data);

    if (req === null)
    {
      throw new RSIError('Failed to retrieve ship data. Request returned null.');
    }
    else if (req.status !== 200)
    {
      throw new RSIError(`Failed to retrieve ship data. Status code: ${req.status}`);
    }

    const resp = req.data;

    // Get html contents
    if (resp.success !== 1)
    {
      throw new RSIError('Failed to retrieve ship data. Response indicates failure.');
    }

    const $ = load(resp.data.html);
    const shipIds: string[] = [];

    $('[data-ship-id]').each((_, element) =>
    {
      const shipId = $(element).attr('data-ship-id');
      if (shipId)
      {
        shipIds.push(shipId.trim());
      }
    });

    return { shipIds, rowcount: resp.data.rowcount };
  }

  return async function (searchArgs: RSIShipSearchParams): Promise<RSIShipSearch[]>
  {
    logger.info('Searching ships', {
      name: searchArgs.name,
      page: searchArgs.page,
      pageMax: searchArgs.page_max
    });

    const name = HttpHelper.stringifyValue(searchArgs.name);
    const classification = HttpHelper.stringifyValue(searchArgs.classification);
    const length_min = HttpHelper.stringifyValue(searchArgs.length_min);
    const length_max = HttpHelper.stringifyValue(searchArgs.length_max);
    const crew_min = HttpHelper.stringifyValue(searchArgs.crew_min);
    const crew_max = HttpHelper.stringifyValue(searchArgs.crew_max);
    const price_min = HttpHelper.stringifyValue(searchArgs.price_min);
    const price_max = HttpHelper.stringifyValue(searchArgs.price_max);
    const mass_min = HttpHelper.stringifyValue(searchArgs.mass_min);
    const mass_max = HttpHelper.stringifyValue(searchArgs.mass_max);
    const status = HttpHelper.stringifyValue(searchArgs.status);
    const size = HttpHelper.stringifyValue(searchArgs.size);
    const sale = searchArgs.sale !== undefined ? searchArgs.sale : null;

    let page: number | string = HttpHelper.stringifyValue(searchArgs.page);
    if (/^\d+?$/.test(page))
    {
      page = parseInt(page);
    } else
    {
      page = 1;
    }

    let page_max: number | string = HttpHelper.stringifyValue(searchArgs.page_max);
    if (/^\d+?$/.test(page_max))
    {
      page_max = parseInt(page_max);
    } else
    {
      page_max = 1;
    }

    const data: Record<string, unknown> = {
      classification: classification,
      itemType: 'ships',
      length: [length_min, length_max].join(','),
      manufacturer_id: [],
      mass: [mass_min, mass_max].join(','),
      max_crew: [crew_min, crew_max].join(','),
      msrp: [price_min, price_max].join(','),
      search: name,
      page: page,
      sort: 'id',
      storefront: 'pledge',
      type: '',
    };

    // Add optional filters if provided
    if (status)
    {
      data.status = status;
    }
    if (size)
    {
      data.size = size;
    }
    if (sale !== null)
    {
      data.sale = sale;
    }

    const shipIds: string[] = [];
    const lastPage = Math.max(page, page_max);

    // Fetch pages in concurrent batches, stop as soon as a batch contains an empty page
    for (let batchStart = page; batchStart <= lastPage; batchStart += pageBatchSize)
    {
      const batchEnd = Math.min(batchStart + pageBatchSize - 1, lastPage);
      const pages = Array.from({ length: batchEnd - batchStart + 1 }, (_, i) => batchStart + i);

      const results = await Promise.all(pages.map(p => searchPage({ ...data, page: p })));

      let reachedEnd = false;
      for (const result of results)
      {
        shipIds.push(...result.shipIds);
        if (result.rowcount === 0)
        {
          reachedEnd = true;
          break;
        }
      }

      if (reachedEnd)
      {
        break;
      }
    }

    const ships = await ShipHelper.mapWithConcurrency(shipIds, shipConcurrency, async shipId =>
    {
      logger.info('Fetching ship details', { shipId });

      const [ship] = await ShipMatrixHelper.fetch(httpClient, { id: shipId });
      if (!ship)
      {
        throw new RSIError(`Ship with ID ${shipId} not found or no data available.`);
      }
      return ship;
    });

    // Variants share a chassis, so one store request prices all of them
    const chassisIds = [...new Set(ships.map(ship => ship.chassis_id))];
    const priceMaps = await ShipHelper.mapWithConcurrency(chassisIds, shipConcurrency, chassisId => ShipStoreHelper.fetchPrices(httpClient, { chassisId }));
    const prices = new Map(priceMaps.flatMap(map => [...map]));

    return ships.map(ship => ShipHelper.toShipSearch(ship, prices));
  };
}
