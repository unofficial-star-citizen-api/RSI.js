import { Ship } from '../src/commands/ship/ship';
import { HttpClient } from '../src/index';

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

describe('Ship', () =>
{
  let httpClient: HttpClient;
  let ship: Ship;

  beforeEach(() =>
  {
    httpClient = new HttpClient();
    ship = new Ship(httpClient);
  });

  afterEach(() =>
  {
    jest.restoreAllMocks();
  });

  describe('search', () =>
  {
    test('should return ships matching the search query', async () =>
    {
      jest.spyOn(httpClient, 'post').mockImplementation((url: string) =>
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

      jest.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: '<html><body><span class="final-price" data-value="9500">$95</span></body></html>'
      } as any);

      const data = await ship.search({ name: 'Cutlass Black' });

      expect(data).not.toBeNull();
      expect(data).toHaveLength(1);
      expect(data[0].name).toBe('Cutlass Black');
      expect(data[0].price).toBe(95);
    });

    test('should return empty array when search finds no ships', async () =>
    {
      jest.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200,
        data: { success: 1, data: { html: '', rowcount: 0 } }
      } as any);

      const data = await ship.search({ name: 'NonExistentShip' });

      expect(data).toEqual([]);
    });

    test('should return empty array when API reports failure', async () =>
    {
      jest.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200,
        data: { success: 0, data: { html: '', rowcount: 0 } }
      } as any);

      const data = await ship.search({ name: 'TestShip' });

      expect(data).toEqual([]);
    });

    test('should return empty array on 404 response', async () =>
    {
      jest.spyOn(httpClient, 'post').mockResolvedValue({
        status: 404,
        data: null
      } as any);

      const data = await ship.search({ name: 'TestShip' });

      expect(data).toEqual([]);
    });

    test('should skip ship when ship-matrix returns no data', async () =>
    {
      jest.spyOn(httpClient, 'post').mockImplementation((url: string) =>
      {
        if (url === SEARCH_URL)
        {
          return Promise.resolve({
            status: 200,
            data: { success: 1, data: { html: SEARCH_HTML, rowcount: 0 } }
          } as any);
        }
        // ship-matrix returns empty
        return Promise.resolve({
          status: 200,
          data: { success: 1, data: [] }
        } as any);
      });

      const data = await ship.search({ name: 'Cutlass Black' });

      expect(data).toEqual([]);
    });

    test('should use price 0 when ship page has no price element', async () =>
    {
      jest.spyOn(httpClient, 'post').mockImplementation((url: string) =>
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

      jest.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: '<html><body>No price here</body></html>'
      } as any);

      const data = await ship.search({ name: 'Cutlass Black' });

      expect(data).toHaveLength(1);
      expect(data[0].price).toBe(0);
    });
  });
});

