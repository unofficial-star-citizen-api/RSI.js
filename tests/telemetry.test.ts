import { Telemetry } from '../src/commands/telemetry/telemetry';
import { HttpClient } from '../src/index';

const TELEMETRY_BASE_URL = 'https://robertsspaceindustries.com/api/telemetry/v2/community/';

const MOCK_TELEMETRY_RESPONSE = {
  success: 1,
  code: 200,
  msg: 'OK',
  data: {
    current: {
      popular_resolutions: [[1920, 1080], [2560, 1440]],
      doc_count: 125000,
      latency_avg: { value: 45.2 },
      load_times_hdd: {
        percent: 30,
        percentiles: { p50: 45, p90: 120 },
        avg: 67.3,
        max: 240,
        min: 12
      },
      load_times_ssd: {
        avg: 18.5,
        max: 60,
        min: 5,
        percent: 70,
        percentiles: { p50: 15, p90: 45 }
      },
      stability_score: 92.5
    },
    past: {
      doc_count: 118000,
      latency_avg: { value: 48.1 }
    }
  }
};

describe('Telemetry', () =>
{
  let httpClient: HttpClient;
  let telemetry: Telemetry;

  beforeEach(() =>
  {
    httpClient = new HttpClient();
    telemetry = new Telemetry(httpClient);
  });

  afterEach(() =>
  {
    jest.restoreAllMocks();
  });

  test('should return telemetry data for MONTH timetable', async () =>
  {
    jest.spyOn(httpClient, 'get').mockResolvedValue({
      status: 200,
      data: MOCK_TELEMETRY_RESPONSE
    } as any);

    const data = await telemetry.community('MONTH', 'sc-alpha-4.0');

    expect(data).not.toBeNull();
    expect(data.success).toBe(1);
    expect(data.data).toBeDefined();
    expect(data.data!.current.doc_count).toBe(125000);
    expect(data.data!.current.stability_score).toBe(92.5);
  });

  test('should call the correct URL with timetable and version', async () =>
  {
    const spy = jest.spyOn(httpClient, 'get').mockResolvedValue({
      status: 200,
      data: MOCK_TELEMETRY_RESPONSE
    } as any);

    await telemetry.community('WEEK', 'sc-alpha-3.24');

    expect(spy).toHaveBeenCalledWith(
      `${TELEMETRY_BASE_URL}?&timetable=WEEK&branch=sc-alpha-3.24`
    );
  });

  test.each(['DAY', 'WEEK', 'MONTH'] as const)(
    'should accept timetable type %s',
    async (timetable) =>
    {
      jest.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: MOCK_TELEMETRY_RESPONSE
      } as any);

      const data = await telemetry.community(timetable, 'sc-alpha-4.0');
      expect(data).not.toBeNull();
    }
  );

  test('should throw on non-200 response', async () =>
  {
    jest.spyOn(httpClient, 'get').mockResolvedValue({
      status: 503,
      data: null
    } as any);

    await expect(telemetry.community('DAY', 'sc-alpha-4.0')).rejects.toThrow(
      'HTTP request failed while retrieving telemetry data, status code: 503'
    );
  });
});

