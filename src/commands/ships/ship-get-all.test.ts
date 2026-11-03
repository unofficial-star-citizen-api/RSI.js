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

  describe('getAll', () =>
  {
    test('should read the whole ship matrix and every store page', async () =>
    {
      const storePages: number[] = [];
      vi.spyOn(httpClient, 'post').mockImplementation((url: string, body?: any) =>
      {
        if (url === MATRIX_URL)
        {
          expect(body).toEqual({});
          return Promise.resolve(matrixResponse([MOCK_SHIP, { ...MOCK_SHIP, id: 99, name: 'Retaliator' }]));
        }
        const { page, ships: input } = body.variables.query;
        expect(input).toEqual({ all: true });
        storePages.push(page);
        // 61 ships in the store: pages of 30, 30 and 1
        return Promise.resolve(storeResponse(page === 3 ? [{ id: '99', msrp: 27500, purchasable: false }] : page === 1 ? [MOCK_STORE_SHIP] : [], 61));
      });

      const data = await ships.getAll();

      expect(storePages.sort()).toEqual([1, 2, 3]);
      expect(data.map(s => [s.id, s.price])).toEqual([[56, 110], [99, 275]]);
    });

    test('should throw when the store answers with a non-200 status', async () =>
    {
      vi.spyOn(httpClient, 'post').mockImplementation((url: string) =>
        Promise.resolve(url === MATRIX_URL ? matrixResponse([MOCK_SHIP]) : { status: 503, data: null } as any));

      await expect(ships.getAll()).rejects.toThrow('Failed to retrieve ship prices. Status code: 503');
    });
  });
});
