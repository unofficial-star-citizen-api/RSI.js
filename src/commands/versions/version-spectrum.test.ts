import
{
  beforeEach,
  describe,
  expect,
  test,
  vi
} from 'vitest';
import { HttpClient } from '../../http-client';
import spectrumThreads from '../spectrum/mocks/threads-p1.json';
import { RSISpectrumGroups } from './interfaces';
import { Spectrum } from './version-spectrum';

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
        expectedGroup: RSISpectrumGroups.GROUP_1
      },
      {
        description: 'should detect Wave 2 PTU',
        thread: { subject: '[Wave 2 PTU] Star Citizen Alpha 3.22.0 PTU.123456 Patch Notes' },
        expectedEnv: 'ptu',
        expectedVer: '3.22.0',
        expectedGroup: RSISpectrumGroups.GROUP_2
      },
      {
        description: 'should detect All Waves PTU',
        thread: { subject: '[ALL WAVES PTU] Star Citizen Alpha 3.22.0 PTU.123456 Patch Notes' },
        expectedEnv: 'ptu',
        expectedVer: '3.22.0',
        expectedGroup: RSISpectrumGroups.ALL
      },
      // Title formats used since 2026
      {
        description: 'should detect a wave without the PTU suffix',
        thread: { subject: '[Wave 3] Star Citizen Alpha 5.0 PTU Patch Notes 13273298' },
        expectedEnv: 'ptu',
        expectedVer: '5.0',
        expectedGroup: RSISpectrumGroups.GROUP_3
      },
      {
        description: 'should detect All Waves without the PTU suffix',
        thread: { subject: '[All Waves] Star Citizen Alpha 4.10.3 PTU RC1 Patch Notes 13160301' },
        expectedEnv: 'ptu',
        expectedVer: '4.10.3',
        expectedGroup: RSISpectrumGroups.ALL
      },
      {
        description: 'should detect All Wave (singular) as every wave',
        thread: { subject: '[All Wave] Star Citizen Alpha 4.10 PTU Patch Notes 12457370' },
        expectedEnv: 'ptu',
        expectedVer: '4.10',
        expectedGroup: RSISpectrumGroups.ALL
      },
      {
        description: 'should detect an Evocati thread as ETF',
        thread: { subject: '[Evocati NDA] Star Citizen Alpha 4.10.2 PTU Patch Notes 12702947' },
        expectedEnv: 'etf',
        expectedVer: '4.10.2',
        expectedGroup: undefined
      },
      {
        description: 'should detect All Backers as every wave',
        thread: { subject: '[All Backers] Star Citizen Alpha 4.10.3 PTU Patch Notes 13107423' },
        expectedEnv: 'ptu',
        expectedVer: '4.10.3',
        expectedGroup: RSISpectrumGroups.ALL
      },
      {
        description: 'should detect a LIVE hotfix thread',
        thread: { subject: 'Star Citizen Alpha 4.10.3 LIVE - Hotfix Central  (Updated 11.19.2026)' },
        expectedEnv: 'live',
        expectedVer: '4.10.3',
        expectedGroup: undefined
      },
      {
        description: 'should not assign a channel to a Tech Preview thread',
        thread: { subject: '[All Backer] TTK TTD Balance Test Tech-Preview #3' },
        expectedEnv: undefined,
        expectedVer: undefined,
        expectedGroup: RSISpectrumGroups.ALL
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
    // Real v2 thread from the Spectrum fixtures, with the subject replaced
    const realThread = spectrumThreads.data[0];
    const thread = (id: number, subject: string): unknown => ({ ...realThread, id, subject, isPinned: false });
    const mockThreadsResponse = {
      status: 200,
      data: {
        success: 1,
        code: 'OK',
        msg: 'OK',
        data: [
          thread(1, 'Star Citizen Alpha 3.22.0 LIVE.123456 Patch Notes'),
          thread(2, '[Wave 1 PTU] Star Citizen Alpha 3.21.0 PTU.123456 Patch Notes'),
          thread(3, 'Star Citizen Alpha 3.20.0 ETF.123456 Evocati Patch Notes')
        ]
      }
    };

    beforeEach(() =>
    {
      // Mock the HTTP client post method
      vi.spyOn(httpClient, 'post').mockResolvedValue(mockThreadsResponse as any);
    });

    test('should read the first page of the patch notes channel', async () =>
    {
      await spectrum.get();

      expect(httpClient.post).toHaveBeenCalledWith('https://robertsspaceindustries.com/api/spectrum/v2/forum/channel/threads', {
        channel_id: '190048',
        page: 1,
        sort: 'newest',
        label_id: null
      });
    });

    test('should report threads without a release channel without one', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        ...mockThreadsResponse,
        data: { ...mockThreadsResponse.data, data: [thread(4, '[All Backer] TTK TTD Balance Test Tech-Preview #3')] }
      } as any);

      const versions = await spectrum.get();

      expect(versions).toEqual([{ name: undefined, environment: undefined }]);
      expect(await spectrum.getPtu()).toEqual([]);
    });

    test('should fetch and parse all versions', async () =>
    {
      const versions = await spectrum.get();

      expect(versions).toHaveLength(3);
      expect(versions[0].environment).toBe('live');
      expect(versions[0].name).toBe('3.22.0');
      expect(versions[1].environment).toBe('ptu');
      expect((versions[1] as any).group).toBe(RSISpectrumGroups.GROUP_1);
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
      expect((ptuVersions[0] as any).group).toBe(RSISpectrumGroups.GROUP_1);
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
        status: 200,
        data: { success: 0, code: 'ErrUnknown', msg: 'API Error' }
      } as any);

      await expect(spectrum.get()).rejects.toThrow('Spectrum query failed (ErrUnknown: API Error)');
    });
  });
});
