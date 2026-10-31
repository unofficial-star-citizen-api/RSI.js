import { RSIError } from '@/errors';
import { HttpClient } from '@/http-client';
import { createLogger } from '@/logger';
import { load } from 'cheerio';
import { HttpHelper } from '../../helpers/http.helper';
import { RSIShipSearch, RSIShipSearchParams } from './interfaces';

type RSIShipSearchDto = Omit<RSIShipSearch, 'meta' | 'price'> & {
  readonly url: string;
  price?: number;
};

/**
 * Ship class for retrieving Star Citizen ship data
 */
export class Ships
{
  private readonly urlSearchShips = 'https://robertsspaceindustries.com/api/store/getShips';
  private readonly urlShipsId = 'https://robertsspaceindustries.com/ship-matrix/index';
  private readonly httpClient: HttpClient;
  private readonly logger = createLogger(Ships.name);
  /** Number of search pages fetched concurrently */
  private readonly pageBatchSize = 5;

  /**
   * Get ships
   * @param httpClient - HTTP client instance for making requests
   */
  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  /**
   * Get all ships using advanced search through pages
   * @param searchArgs - Search parameters for filtering ships
   * @returns Ships data
   */
  public async search(searchArgs: RSIShipSearchParams): Promise<RSIShipSearch[]>
  {
    this.logger.info('Searching ships', {
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

    const ships: RSIShipSearch[] = [];
    const lastPage = Math.max(page, page_max);

    // Fetch pages in concurrent batches, stop as soon as a batch contains an empty page
    for (let batchStart = page; batchStart <= lastPage; batchStart += this.pageBatchSize)
    {
      const batchEnd = Math.min(batchStart + this.pageBatchSize - 1, lastPage);
      const pages = Array.from({ length: batchEnd - batchStart + 1 }, (_, i) => batchStart + i);

      const results = await Promise.all(pages.map(p => this.searchPage({ ...data, page: p })));

      let reachedEnd = false;
      for (const result of results)
      {
        ships.push(...result.ships);
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

    return ships;
  }

  /**
   * Fetch a single search page and resolve its ships
   * @param data - Search payload including the page number
   * @returns Ships of the page and the page row count
   */
  private async searchPage(data: Record<string, unknown>): Promise<{ ships: RSIShipSearch[]; rowcount: number; }>
  {
    const req = await this.httpClient.post<{
      success: number;
      data: {
        html: string;
        rowcount: number;
      };
    }>(this.urlSearchShips, data);

    if (req === null)
    {
      throw new RSIError('Failed to retrieve ship data. Request returned null.');
    }
    else if (req.status === 404)
    {
      throw new RSIError(`Failed to retrieve ship data. Status code: ${req.status}`);
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

    const ships: RSIShipSearch[] = [];
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

    // Process all ships in parallel
    const shipResults = await Promise.all(
      shipIds.map(id => this.getShipAsync(id))
    );

    for (const result of shipResults.filter(Boolean))
    {
      const [respShip, reqPage] = result as [RSIShipSearchDto, { data: string; }];

      const pageContent = load(reqPage.data);

      // Get the Ship price
      let price = 0;
      pageContent('[data-value].final-price').each((_, element) =>
      {
        const priceVal = parseInt($(element).attr('data-value') || '0');
        const p = priceVal / 100;

        if (price === 0 || price > p)
        {
          price = p;
        }
      });

      respShip.price = price;
      ships.push(this.toShipSearch(respShip));
    }

    return { ships, rowcount: resp.data.rowcount };
  }

  /**
   * Get ship by its ID
   * @param shipId - The ship ID
   * @returns Ship data and page response
   */
  private async getShipAsync(shipId: string): Promise<[RSIShipSearchDto, { data: string; }] | null>
  {
    this.logger.info('Fetching ship details', { shipId });

    const respShip = await this.getShipById(shipId);
    if (!respShip)
    {
      throw new RSIError(`Ship with ID ${shipId} not found or no data available.`);
    }

    if (!respShip.url)
    {
      throw new RSIError(`Ship with ID ${shipId} does not have a valid URL for further details.`);
    }

    const pageUrl = HttpClient.toAbsoluteUrl(respShip.url);
    if (!pageUrl)
    {
      throw new RSIError(`Ship with ID ${shipId} does not have a valid URL for further details.`);
    }

    const reqPage = await this.httpClient.get<string>(pageUrl);

    if (reqPage === null || reqPage.status !== 200)
    {
      throw new RSIError(`Failed to retrieve ship page for ID ${shipId}. Status code: ${reqPage?.status}`);
    }

    return [respShip, reqPage];
  }

  /**
   * Get a ship by its ship_id
   * @param shipId - The ship ID
   * @param getPrice - If the price needs to be retrieved
   * @returns The ship data
   */
  private async getShipById(shipId?: string, getPrice: boolean = false): Promise<RSIShipSearchDto | null>
  {
    const parameters: Record<string, string> = {};
    if (shipId !== undefined)
    {
      parameters.id = shipId;
    }

    const request = await this.httpClient.post<{
      success: number;
      data?: RSIShipSearchDto[];
    }>(this.urlShipsId, parameters);

    if (request === null)
    {
      throw new RSIError('Failed to retrieve ship data. Request returned null.');
    }
    else if (request.status === 404)
    {
      throw new RSIError(`Ship with ID ${shipId} not found.`);
    }
    else if (request.status !== 200)
    {
      throw new RSIError(`Failed to retrieve ship data. Status code: ${request.status}`);
    }

    const respShip = request.data;

    if (respShip.success !== 1 || !respShip.data || respShip.data.length === 0)
    {
      throw new RSIError(`Ship with ID ${shipId} not found or no data available.`);
    }

    const res: RSIShipSearchDto | RSIShipSearchDto[] = shipId === undefined ? respShip.data : respShip.data[0];

    if (getPrice)
    {
      const shipsToPrice = Array.isArray(res) ? res : [res];

      for (const s of shipsToPrice)
      {
        if (s.url)
        {
          const reqPage = await this.httpClient.get<string>(HttpClient.host + s.url);

          if (reqPage !== null && reqPage.status === 200)
          {
            const pageTree = load(reqPage.data);

            // Get the Ship price
            let price = 0;
            pageTree('[data-value].final-price').each((_, element) =>
            {
              const priceVal = parseInt(pageTree(element).attr('data-value') || '0');
              const p = priceVal / 100;

              if (price === 0 || price > p)
              {
                price = p;
              }
            });

            s.price = price;
          }
        }
      }
    }

    // Convert array result to single ship when needed
    return Array.isArray(res) ? (shipId === undefined ? null : res[0]) : res;
  }

  private toShipSearch(ship: RSIShipSearchDto): RSIShipSearch
  {
    const {
      url,
      price,
      ...data
    } = ship;
    return {
      ...data,
      meta: {
        url: HttpClient.toAbsoluteUrl(url)
      },
      price: price ?? 0
    };
  }
}
