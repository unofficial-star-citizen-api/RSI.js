import { HttpClient } from '@/http-client';
import { load } from 'cheerio';
import { HttpHelper } from '../../helpers/http.helper';

interface RSIShipData
{
  id?: string;
  name?: string;
  url?: string;
  price?: number;
  [key: string]: unknown;
}

type RSISearchArgs = {
  name?: string;
  classification?: string;
  length_min?: number;
  length_max?: number;
  crew_min?: number;
  crew_max?: number;
  price_min?: number;
  price_max?: number;
  mass_min?: number;
  mass_max?: number;
  page_max?: number;
  page?: number;
};

/**
 * Ship class for retrieving Star Citizen ship data
 */
export class Ship
{
  private readonly urlSearchShips = 'https://robertsspaceindustries.com/api/store/getShips';
  private readonly urlShipsId = 'https://robertsspaceindustries.com/ship-matrix/index';
  private readonly httpClient: HttpClient;

  /**
   * Get ships
   * @param kwargs - Search parameters
   */
  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  /**
   * Get all ships using advanced search through pages
   * @returns Ships data
   */
  public async search(searchArgs: RSISearchArgs): Promise<RSIShipData[]>
  {
    const name = HttpHelper.convertVal(searchArgs.name);
    const classification = HttpHelper.convertVal(searchArgs.classification);
    const length_min = HttpHelper.convertVal(searchArgs.length_min);
    const length_max = HttpHelper.convertVal(searchArgs.length_max);
    const crew_min = HttpHelper.convertVal(searchArgs.crew_min);
    const crew_max = HttpHelper.convertVal(searchArgs.crew_max);
    const price_min = HttpHelper.convertVal(searchArgs.price_min);
    const price_max = HttpHelper.convertVal(searchArgs.price_max);
    const mass_min = HttpHelper.convertVal(searchArgs.mass_min);
    const mass_max = HttpHelper.convertVal(searchArgs.mass_max);

    let page: number | string = HttpHelper.convertVal(searchArgs.page);
    if (/^\d+?$/.test(page))
    {
      page = parseInt(page);
    } else
    {
      page = 1;
    }

    let page_max: number | string = HttpHelper.convertVal(searchArgs.page_max);
    if (/^\d+?$/.test(page_max))
    {
      page_max = parseInt(page_max);
    } else
    {
      page_max = 1;
    }

    const data = {
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

    const req = await this.httpClient.post<{
      success: number;
      data: {
        html: string;
        rowcount: number;
      };
    }>(this.urlSearchShips, data);

    if (req === null)
    {
      return [];
    } else if (req.status === 404)
    {
      return [];
    } else if (req.status !== 200)
    {
      return [];
    }

    const resp = req.data;

    // Get html contents
    if (resp.success !== 1)
    {
      return [];
    }

    const ships: RSIShipData[] = [];
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
      const [respShip, reqPage] = result as [RSIShipData, { data: string; }];

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
      ships.push(respShip);
    }

    if (resp.data.rowcount !== 0 && typeof page === 'number' && page < (typeof page_max === 'number' ? page_max : 1))
    {
      const newKwargs = { ...searchArgs, page: page + 1 };
      const nextPageShips = await this.search(newKwargs);
      if (nextPageShips && nextPageShips.length > 0)
      {
        ships.push(...nextPageShips);
      }
    }

    return ships;
  }

  /**
   * Get ship by its ID
   * @param shipId - The ship ID
   * @returns Ship data and page response
   */
  private async getShipAsync(shipId: string): Promise<[RSIShipData, { data: string; }] | null>
  {
    const respShip = await this.getShipById(shipId);
    if (!respShip)
    {
      return null;
    }

    if (!respShip.url)
    {
      return null;
    }

    const reqPage = await this.httpClient.get<string>(HttpClient.host + respShip.url);

    if (reqPage === null || reqPage.status !== 200)
    {
      return null;
    }

    return [respShip, reqPage];
  }

  /**
   * Get a ship by its ship_id
   * @param shipId - The ship ID
   * @param getPrice - If the price needs to be retrieved
   * @returns The ship data
   */
  private async getShipById(shipId?: string, getPrice: boolean = false): Promise<RSIShipData | null>
  {
    const parameters: Record<string, string> = {};
    if (shipId !== undefined)
    {
      parameters.id = shipId;
    }

    const req = await this.httpClient.post<{
      success: number;
      data?: RSIShipData[];
    }>(this.urlShipsId, parameters);

    if (req === null)
    {
      return null;
    } else if (req.status === 404)
    {
      return {};
    } else if (req.status !== 200)
    {
      return null;
    }

    const respShip = req.data;

    if (respShip.success !== 1 || !respShip.data || respShip.data.length === 0)
    {
      return null;
    }

    let res: RSIShipData | RSIShipData[] = [];
    if (shipId === undefined)
    {
      res = respShip.data;
    } else
    {
      res = respShip.data[0];
    }

    if (getPrice)
    {
      const ships = Array.isArray(res) ? res : [res];

      for (const s of ships)
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
}
