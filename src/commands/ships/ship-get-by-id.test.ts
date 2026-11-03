import
{
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi
} from 'vitest';
import { HttpClient } from '../../index';
import { Logger } from '../../logger';
import { GRAPHQL_URL, MATRIX_URL, MOCK_SHIP, MOCK_STORE_SHIP, matrixResponse, storeResponse } from './mocks/ship.mock';
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
  });

  describe('getById', () =>
  {
    test('should return the ship with its store price', async () =>
    {
      const postSpy = vi.spyOn(httpClient, 'post').mockImplementation((url: string) =>
      {
        if (url === MATRIX_URL)
        {
          return Promise.resolve(matrixResponse([MOCK_SHIP]));
        }
        if (url === GRAPHQL_URL)
        {
          return Promise.resolve(storeResponse([MOCK_STORE_SHIP, { id: '57', msrp: 13500, purchasable: false }]));
        }
        return Promise.reject(new Error(`Unexpected POST to ${url}`));
      });

      const ship = await ships.getById(56);

      expect(ship).not.toBeNull();
      expect(ship!.name).toBe('Cutlass Black');
      expect(ship!.price).toBe(110);
      expect(ship!.purchasable).toBe(true);
      expect(ship!.meta.url).toBe('https://robertsspaceindustries.com/pledge/ships/cutlass/Cutlass-Black');
      expect(postSpy).toHaveBeenCalledWith(MATRIX_URL, { id: '56' });
      expect((postSpy.mock.calls[1][1] as any).variables.query.ships).toEqual({ chassisId: 6 });
    });

    test('should return null when no ship has this ID', async () =>
    {
      const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(matrixResponse([]));

      expect(await ships.getById(999999)).toBeNull();
      expect(postSpy).toHaveBeenCalledTimes(1);
    });

    test('should use price 0 when the store does not list the ship', async () =>
    {
      vi.spyOn(httpClient, 'post').mockImplementation((url: string) =>
        Promise.resolve(url === MATRIX_URL ? matrixResponse([MOCK_SHIP]) : storeResponse([])));

      const ship = await ships.getById(56);

      expect(ship!.price).toBe(0);
      expect(ship!.purchasable).toBe(false);
    });

    test('should reject an invalid ID', async () =>
    {
      await expect(ships.getById(1.5)).rejects.toThrow('Ship ID must be a positive integer. Received: 1.5');
      await expect(ships.getById(0)).rejects.toThrow('Ship ID must be a positive integer. Received: 0');
    });

    test('should throw when the store returns GraphQL errors', async () =>
    {
      vi.spyOn(httpClient, 'post').mockImplementation((url: string) =>
        Promise.resolve(url === MATRIX_URL
          ? matrixResponse([MOCK_SHIP])
          : { status: 200, data: { errors: [{ message: 'ErrValidationFailed' }], data: { store: { search: null } } } } as any));

      await expect(ships.getById(56)).rejects.toThrow('Failed to retrieve ship prices. API returned errors');
    });

    test('should throw when the ship matrix reports failure', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({ status: 200, data: { success: 0 } } as any);

      await expect(ships.getById(56)).rejects.toThrow('Failed to retrieve ship data. Response indicates failure.');
    });
  });
});
