
import
{
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi
} from 'vitest';
import { HttpClient, RSI } from '../../index';
import { Logger } from '../../logger';
import {
  GRAPHQL_URL,
  MATRIX_URL,
  MOCK_SHIP,
  MOCK_STORE_SHIP,
  SEARCH_HTML,
  SEARCH_URL,
  matrixResponse,
  searchResponse,
  storeResponse
} from './mocks/ship.mock';
import { Ships } from './ships';

describe('Ships', () =>
{
  let httpClient: HttpClient;
  let ships: Ships;

  beforeEach(() =>
  {
    Logger.enabled = false;
    httpClient = new HttpClient();
    ships = new Ships(httpClient);
  });

  afterEach(() =>
  {
    vi.restoreAllMocks();
    Logger.enabled = false;
  });

  describe('search', () =>
  {
    test('should log ship search and detail commands when enabled', async () =>
    {
      const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
      httpClient = new RSI({ logging: true }).httpClient;
      ships = new Ships(httpClient);

      vi.spyOn(httpClient, 'post').mockImplementation((url: string) =>
      {
        if (url === SEARCH_URL)
        {
          return Promise.resolve(searchResponse(SEARCH_HTML));
        }
        if (url === GRAPHQL_URL)
        {
          return Promise.resolve(storeResponse([MOCK_STORE_SHIP]));
        }
        return Promise.resolve(matrixResponse([MOCK_SHIP]));
      });

      await ships.search({ name: 'Cutlass Black' });

      expect(infoSpy).toHaveBeenCalledWith('[Ships] Searching ships', {
        name: 'Cutlass Black',
        page: undefined,
        pageMax: undefined
      });
      expect(infoSpy).toHaveBeenCalledWith('[Ships] Fetching ship details', { shipId: '56' });
    });

    test('should return ships matching the search query', async () =>
    {
      vi.spyOn(httpClient, 'post').mockImplementation((url: string) =>
      {
        if (url === SEARCH_URL)
        {
          return Promise.resolve(searchResponse(SEARCH_HTML));
        }
        if (url === MATRIX_URL)
        {
          return Promise.resolve(matrixResponse([MOCK_SHIP]));
        }
        if (url === GRAPHQL_URL)
        {
          return Promise.resolve(storeResponse([MOCK_STORE_SHIP]));
        }
        return Promise.reject(new Error(`Unexpected POST to ${url}`));
      });

      const data = await ships.search({ name: 'Cutlass Black' });

      expect(data).not.toBeNull();
      expect(data).toHaveLength(1);
      expect(data[0].name).toBe('Cutlass Black');
      expect(data[0].meta.url).toBe('https://robertsspaceindustries.com/pledge/ships/cutlass/Cutlass-Black');
      expect(data[0].price).toBe(110);
      expect(data[0].purchasable).toBe(true);
    });

    test('should fetch store prices once per chassis', async () =>
    {
      let graphqlCalls = 0;
      vi.spyOn(httpClient, 'post').mockImplementation((url: string, body?: any) =>
      {
        if (url === SEARCH_URL)
        {
          return Promise.resolve(searchResponse('<div data-ship-id="56"></div><div data-ship-id="57"></div>'));
        }
        if (url === MATRIX_URL)
        {
          return Promise.resolve(matrixResponse([{ ...MOCK_SHIP, id: Number(body.id) }]));
        }
        graphqlCalls++;
        return Promise.resolve(storeResponse([MOCK_STORE_SHIP, { id: '57', msrp: 13500, purchasable: false }]));
      });

      const data = await ships.search({ name: 'Cutlass' });

      expect(graphqlCalls).toBe(1);
      expect(data.map(s => s.price)).toEqual([110, 135]);
    });

    test('should return empty array when search finds no ships (success=1, empty HTML)', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue(searchResponse(''));

      const data = await ships.search({ name: 'NonExistentShip' });

      expect(data).toEqual([]);
    });

    test('should throw error when API reports failure', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200,
        data: { success: 0, data: { html: '', rowcount: 0 } }
      } as any);

      await expect(ships.search({ name: 'TestShip' })).rejects.toThrow('Failed to retrieve ship data. Response indicates failure.');
    });

    test('should throw error on 404 response', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 404,
        data: null
      } as any);

      await expect(ships.search({ name: 'TestShip' })).rejects.toThrow('Failed to retrieve ship data. Status code: 404');
    });

    test('should throw error when ship-matrix returns no data', async () =>
    {
      vi.spyOn(httpClient, 'post').mockImplementation((url: string) =>
        Promise.resolve(url === SEARCH_URL ? searchResponse(SEARCH_HTML) : matrixResponse([])));

      await expect(ships.search({ name: 'Cutlass Black' })).rejects.toThrow('Ship with ID 56 not found or no data available.');
    });

    test('should fetch pages in batches and stop after the first empty page', async () =>
    {
      const requestedPages: number[] = [];
      vi.spyOn(httpClient, 'post').mockImplementation((url: string, body?: any) =>
      {
        if (url === SEARCH_URL)
        {
          requestedPages.push(body.page);
          const hasShips = body.page <= 7;
          return Promise.resolve(searchResponse(hasShips ? `<div data-ship-id="${body.page}"></div>` : '', hasShips ? 1 : 0));
        }
        if (url === GRAPHQL_URL)
        {
          return Promise.resolve(storeResponse([]));
        }
        return Promise.resolve(matrixResponse([{ ...MOCK_SHIP, id: body.id }]));
      });

      const data = await ships.search({ page_max: 100 });

      // Pages 1-5 then 6-10; page 8 is empty, so no further batch is requested
      expect(requestedPages.sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expect(data.map(s => s.id)).toEqual(['1', '2', '3', '4', '5', '6', '7']);
    });

    test('should not exceed page_max', async () =>
    {
      const requestedPages: number[] = [];
      vi.spyOn(httpClient, 'post').mockImplementation((url: string, body?: any) =>
      {
        if (url === SEARCH_URL)
        {
          requestedPages.push(body.page);
          return Promise.resolve(searchResponse('', 10));
        }
        return Promise.reject(new Error(`Unexpected POST to ${url}`));
      });

      await ships.search({ page: 2, page_max: 3 });

      expect(requestedPages.sort((a, b) => a - b)).toEqual([2, 3]);
    });
  });
});
