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
import { Ships } from './ships';

const SEARCH_URL = 'https://robertsspaceindustries.com/api/store/getShips';
const MATRIX_URL = 'https://robertsspaceindustries.com/ship-matrix/index';

const MOCK_SHIP = {
  id: '56',
  name: 'Cutlass Black',
  url: '/pledge/ships/cutlass/Cutlass-Black',
  afterburner_speed: '1228',
  beam: '26',
  cargocapacity: '46',
  chassis_id: '12',
  compiled: { RSIAvionic: { computers: [] } }
};

const SEARCH_HTML = '<div data-ship-id="56"></div>';

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
          return Promise.resolve({
            status: 200,
            data: { success: 1, data: { html: SEARCH_HTML, rowcount: 0 } }
          } as any);
        }
        return Promise.resolve({
          status: 200,
          data: { success: 1, data: [MOCK_SHIP] }
        } as any);
      });
      vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: '<html><body></body></html>'
      } as any);

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
          return Promise.resolve({
            status: 200,
            data: { success: 1, data: { html: SEARCH_HTML, rowcount: 0 } }
          } as any);
        }
        if (url === MATRIX_URL)
        {
          return Promise.resolve({
            status: 200,
            data: { success: 1, data: [MOCK_SHIP] }
          } as any);
        }
        return Promise.reject(new Error(`Unexpected POST to ${url}`));
      });

      vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: '<html><body><span class="final-price" data-value="9500">$95</span></body></html>'
      } as any);

      const data = await ships.search({ name: 'Cutlass Black' });

      expect(data).not.toBeNull();
      expect(data).toHaveLength(1);
      expect(data[0].name).toBe('Cutlass Black');
      expect(data[0].meta.url).toBe('https://robertsspaceindustries.com/pledge/ships/cutlass/Cutlass-Black');
      expect(data[0].price).toBe(95);
    });

    test('should return empty array when search finds no ships (success=1, empty HTML)', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200,
        data: { success: 1, data: { html: '', rowcount: 0 } }
      } as any);

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
      {
        if (url === SEARCH_URL)
        {
          return Promise.resolve({
            status: 200,
            data: { success: 1, data: { html: SEARCH_HTML, rowcount: 0 } }
          } as any);
        }
        // ship-matrix returns empty array -> getShipAsync throws
        return Promise.resolve({
          status: 200,
          data: { success: 1, data: [] }
        } as any);
      });

      await expect(ships.search({ name: 'Cutlass Black' })).rejects.toThrow('Ship with ID 56 not found or no data available.');
    });

    test('should use price 0 when ship page has no price element', async () =>
    {
      vi.spyOn(httpClient, 'post').mockImplementation((url: string) =>
      {
        if (url === SEARCH_URL)
        {
          return Promise.resolve({
            status: 200,
            data: { success: 1, data: { html: SEARCH_HTML, rowcount: 0 } }
          } as any);
        }
        return Promise.resolve({
          status: 200,
          data: { success: 1, data: [MOCK_SHIP] }
        } as any);
      });

      vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: '<html><body>No price here</body></html>'
      } as any);

      const data = await ships.search({ name: 'Cutlass Black' });

      expect(data).toHaveLength(1);
      expect(data[0].price).toBe(0);
    });
  });
});
