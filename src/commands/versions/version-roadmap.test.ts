import
{
  beforeEach,
  describe,
  expect,
  test,
  vi
} from 'vitest';
import { HttpClient } from '../../http-client';
import mockWithLiveAndEtf from './mocks/roadmap-live-etf.json';
import mockWithLiveAndPtu from './mocks/roadmap-live-ptu.json';
import mockWithLive from './mocks/roadmap-live.json';
import { Roadmap } from './version-roadmap';

describe('Roadmap', () =>
{
  let httpClient: HttpClient;
  let roadmap: Roadmap;

  beforeEach(() =>
  {
    httpClient = new HttpClient();
    roadmap = new Roadmap(httpClient);
  });

  describe('Version Extraction', () =>
  {
    beforeEach(() =>
    {
      // Reset mock before each test
      vi.resetAllMocks();
    });

    test('should extract versions from roadmap description', async () =>
    {
      // Mock the HTTP client get method
      const spy = vi.spyOn(httpClient, 'get').mockResolvedValue({ status: 200, data: mockWithLiveAndPtu } as any);

      const versions = await roadmap.getVersions();

      expect(versions.live).toBe('4.0.1');
      expect(versions.ptu).toBe('4.0.2');
      expect(versions.etf).toBeNull();

      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });

    test('should extract Live version when present', async () =>
    {
      // Mock the HTTP client get method for ETF version
      vi.spyOn(httpClient, 'get').mockResolvedValue({ status: 200, data: mockWithLive } as any);

      const versions = await roadmap.getVersions();

      expect(versions.live).toBe('4.0.1');
      expect(versions.ptu).toBeNull();
      expect(versions.etf).toBeNull();
    });

    test('should extract PTU version when present', async () =>
    {
      // Mock the HTTP client get method for ETF version
      vi.spyOn(httpClient, 'get').mockResolvedValue({ status: 200, data: mockWithLiveAndPtu } as any);

      const versions = await roadmap.getVersions();

      expect(versions.live).toBe('4.0.1');
      expect(versions.ptu).toBe('4.0.2');
      expect(versions.etf).toBeNull();
    });

    test('should extract ETF version when present', async () =>
    {
      // Mock the HTTP client get method for ETF version
      vi.spyOn(httpClient, 'get').mockResolvedValue({ status: 200, data: mockWithLiveAndEtf } as any);

      const versions = await roadmap.getVersions();

      expect(versions.live).toBe('4.0.1');
      expect(versions.ptu).toBeNull();
      expect(versions.etf).toBe('4.1.0');
    });

    test('should not keep punctuation after a version', async () =>
    {
      const board = { ...mockWithLive.data.boards[0], description: 'Live version: 3.18.0, PTU Version: 3.19.0a PTU 9584587' };
      vi.spyOn(httpClient, 'get').mockResolvedValue({ status: 200, data: { ...mockWithLive, data: { ...mockWithLive.data, boards: [board] } } } as any);

      const versions = await roadmap.getVersions();

      expect(versions).toEqual({ live: '3.18.0', ptu: '3.19.0a', etf: null });
    });

    test('should throw RSIError when the Star Citizen board is missing', async () =>
    {
      const boards = mockWithLive.data.boards.filter(board => board.id !== 1);
      vi.spyOn(httpClient, 'get').mockResolvedValue({ status: 200, data: { ...mockWithLive, data: { ...mockWithLive.data, boards } } } as any);

      await expect(roadmap.getVersions()).rejects.toThrow('The Star Citizen roadmap board is missing');
    });

    test('should handle API error', async () =>
    {
      vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
        status: 200,
        data: { success: 0, msg: 'API Error' }
      } as any);

      await expect(roadmap.getVersions()).rejects.toThrow('Query failed from RSI (API Error)');
    });

    test('should get live version directly', async () =>
    {
      vi.spyOn(httpClient, 'get').mockResolvedValue({ status: 200, data: mockWithLive } as any);
      const spy = vi.spyOn(roadmap, 'getVersions');

      const liveVersion = await roadmap.getLiveVersion();

      expect(liveVersion).toBe('4.0.1');
      expect(spy).toHaveBeenCalledTimes(1);
    });

    test('should get PTU version directly', async () =>
    {
      vi.spyOn(httpClient, 'get').mockResolvedValue({ status: 200, data: mockWithLiveAndPtu } as any);
      const spy = vi.spyOn(roadmap, 'getVersions');

      const ptuVersion = await roadmap.getPTUVersion();

      expect(ptuVersion).toBe('4.0.2');
      expect(spy).toHaveBeenCalledTimes(1);
    });

    test('should get ETF version directly', async () =>
    {
      vi.spyOn(httpClient, 'get').mockResolvedValue({ status: 200, data: mockWithLiveAndEtf } as any);
      const spy = vi.spyOn(roadmap, 'getVersions');

      const etfVersion = await roadmap.getETFVersion();

      expect(etfVersion).toBe('4.1.0');
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
