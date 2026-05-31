import
{
  beforeEach,
  describe,
  expect,
  test,
  vi
} from 'vitest';
import { Groups, Spectrum } from '../../src/commands/version/version-spectrum';
import { HttpClient } from '../../src/http-client';

describe('Spectrum', () =>
{
  let httpClient: HttpClient;
  let spectrum: Spectrum;

  beforeEach(() =>
  {
    httpClient = new HttpClient();
    spectrum = new Spectrum(httpClient);
  });

  describe('Environment and Version Detection', () =>
  {

    // Tests for private methods using TypeScript accessor workaround
    const testCases = [
      {
        description: 'should detect LIVE environment',
        thread: { subject: 'Star Citizen Alpha 3.22.0 LIVE.123456 Patch Notes' },
        expectedEnv: 'live',
        expectedVer: '3.22.0',
        expectedGroup: undefined
      },
      {
        description: 'should detect PTU environment',
        thread: { subject: 'Star Citizen Alpha 3.22.0 PTU.123456 Patch Notes' },
        expectedEnv: 'ptu',
        expectedVer: '3.22.0',
        expectedGroup: undefined
      },
      {
        description: 'should detect ETF environment',
        thread: { subject: 'Star Citizen Alpha 3.22.0 EPTU.123456 Evocati Patch Notes' },
        expectedEnv: 'etf',
        expectedVer: '3.22.0',
        expectedGroup: undefined
      },
      {
        description: 'should detect Wave 1 PTU',
        thread: { subject: '[Wave 1 PTU] Star Citizen Alpha 3.22.0 PTU.123456 Patch Notes' },
        expectedEnv: 'ptu',
        expectedVer: '3.22.0',
        expectedGroup: Groups.GROUP_1
      },
      {
        description: 'should detect Wave 2 PTU',
        thread: { subject: '[Wave 2 PTU] Star Citizen Alpha 3.22.0 PTU.123456 Patch Notes' },
        expectedEnv: 'ptu',
        expectedVer: '3.22.0',
        expectedGroup: Groups.GROUP_2
      },
      {
        description: 'should detect All Waves PTU',
        thread: { subject: '[ALL WAVES PTU] Star Citizen Alpha 3.22.0 PTU.123456 Patch Notes' },
        expectedEnv: 'ptu',
        expectedVer: '3.22.0',
        expectedGroup: Groups.ALL
      }
    ];

    test.each(testCases)('$description', ({
      thread, expectedEnv, expectedVer, expectedGroup
    }) =>
    {
      // Access private methods for testing through type casting
      const env = spectrum['getEnvironment']({ subject: thread.subject } as any);
      const version = spectrum['getVersionFromSubject']({ subject: thread.subject } as any);
      const group = spectrum['getGroup']({ subject: thread.subject } as any);

      expect(env).toBe(expectedEnv);
      expect(version).toBe(expectedVer);
      expect(group).toBe(expectedGroup);
    });
  });

  describe('API Methods', () =>
  {
    const mockThreadsResponse = {
      data: {
        success: 1,
        data: {
          threads: [
            {
              subject: 'Star Citizen Alpha 3.22.0 LIVE.123456 Patch Notes',
              thread_id: '1'
            },
            {
              subject: '[Wave 1 PTU] Star Citizen Alpha 3.21.0 PTU.123456 Patch Notes',
              thread_id: '2'
            },
            {
              subject: 'Star Citizen Alpha 3.20.0 ETF.123456 Evocati Patch Notes',
              thread_id: '3'
            }
          ]
        }
      }
    };

    beforeEach(() =>
    {
      // Mock the HTTP client post method
      vi.spyOn(httpClient, 'post').mockResolvedValue(mockThreadsResponse as any);
    });

    test('should fetch and parse all versions', async () =>
    {
      const versions = await spectrum.get();

      expect(versions).toHaveLength(3);
      expect(versions[0].environment).toBe('live');
      expect(versions[0].name).toBe('3.22.0');
      expect(versions[1].environment).toBe('ptu');
      expect((versions[1] as any).group).toBe(Groups.GROUP_1);
      expect(versions[2].environment).toBe('etf');
    });

    test('should filter live versions', async () =>
    {
      const liveVersions = await spectrum.getLive();

      expect(liveVersions).toHaveLength(1);
      expect(liveVersions[0].environment).toBe('live');
      expect(liveVersions[0].name).toBe('3.22.0');
    });

    test('should filter PTU versions', async () =>
    {
      const ptuVersions = await spectrum.getPtu();

      expect(ptuVersions).toHaveLength(1);
      expect(ptuVersions[0].environment).toBe('ptu');
      expect((ptuVersions[0] as any).group).toBe(Groups.GROUP_1);
    });

    test('should filter ETF versions', async () =>
    {
      const etfVersions = await spectrum.getEtf();

      expect(etfVersions).toHaveLength(1);
      expect(etfVersions[0].environment).toBe('etf');
    });

    test('should handle API error', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValueOnce({
        data: { success: 0, msg: 'API Error' }
      } as any);

      await expect(spectrum.get()).rejects.toThrow('Query failed from RSI (API Error)');
    });
  });
});
