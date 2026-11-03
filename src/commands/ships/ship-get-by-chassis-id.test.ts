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
import { MATRIX_URL, MOCK_SHIP, MOCK_STORE_SHIP, matrixResponse, storeResponse } from './mocks/ship.mock';
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

  describe('getByChassisId', () =>
  {
    test('should return every variant of the chassis with prices', async () =>
    {
      const postSpy = vi.spyOn(httpClient, 'post').mockImplementation((url: string) =>
      {
        if (url === MATRIX_URL)
        {
          return Promise.resolve(matrixResponse([MOCK_SHIP, { ...MOCK_SHIP, id: 57, name: 'Cutlass Red' }]));
        }
        return Promise.resolve(storeResponse([MOCK_STORE_SHIP, { id: '57', msrp: 13500, purchasable: false }]));
      });

      const data = await ships.getByChassisId(6);

      expect(data.map(s => [s.name, s.price, s.purchasable])).toEqual([
        ['Cutlass Black', 110, true],
        ['Cutlass Red', 135, false]
      ]);
      expect(postSpy).toHaveBeenCalledWith(MATRIX_URL, { chassis_id: '6' });
    });

    test('should return an empty array for an unknown chassis', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue(matrixResponse([]));

      expect(await ships.getByChassisId(999999)).toEqual([]);
    });

    test('should reject an invalid chassis ID', async () =>
    {
      await expect(ships.getByChassisId(-1)).rejects.toThrow('Chassis ID must be a positive integer. Received: -1');
    });
  });
});
