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
import { FundingGoals } from './funding-goals';

const STATS_URL = 'https://robertsspaceindustries.com/api/stats/getCrowdfundStats';

const MOCK_STATS_RESPONSE = {
  success: 1,
  code: 'OK',
  msg: 'OK',
  data: {
    chart: {
      '2025-03-01': { gross: '100000', axis: '2025-03-01' }
    },
    fans: 5000000,
    funds: 750000000,
    fleet: null,
    alpha_slots_left: 0
  }
};

describe('Stats (FundingGoals)', () =>
{
  let httpClient: HttpClient;
  let fundingGoals: FundingGoals;

  beforeEach(() =>
  {
    httpClient = new HttpClient();
    fundingGoals = new FundingGoals(httpClient);
  });

  afterEach(() =>
  {
    vi.restoreAllMocks();
  });

  test('should return crowdfunding stats with correct shape', async () =>
  {
    vi.spyOn(httpClient, 'post').mockResolvedValue({
      status: 200,
      data: MOCK_STATS_RESPONSE
    } as any);

    const data = await fundingGoals.getCrowStats('hour');

    expect(data).not.toBeNull();
    expect(data.fans).toBe(5000000);
    expect(data.funds).toBe(750000000);
    expect(data.chart).toBeDefined();
  });

  test('should call the correct URL with chart type parameters', async () =>
  {
    const spy = vi.spyOn(httpClient, 'post').mockResolvedValue({
      status: 200,
      data: MOCK_STATS_RESPONSE
    } as any);

    await fundingGoals.getCrowStats('day');

    expect(spy).toHaveBeenCalledWith(
      STATS_URL,
      expect.objectContaining({ chart: 'day' })
    );
  });

  test.each(['hour', 'day', 'week', 'month'] as const)(
    'should accept chart type %s',
    async (chart) =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200,
        data: MOCK_STATS_RESPONSE
      } as any);

      const data = await fundingGoals.getCrowStats(chart);
      expect(data).not.toBeNull();
    }
  );

  test('should include all required request parameters', async () =>
  {
    const spy = vi.spyOn(httpClient, 'post').mockResolvedValue({
      status: 200,
      data: MOCK_STATS_RESPONSE
    } as any);

    await fundingGoals.getCrowStats('hour');

    expect(spy).toHaveBeenCalledWith(
      STATS_URL,
      expect.objectContaining({
        alpha_slots: true,
        fans: true,
        fleet: true,
        funds: true
      })
    );
  });

  test('should throw on non-200 response', async () =>
  {
    vi.spyOn(httpClient, 'post').mockResolvedValue({
      status: 500,
      data: null
    } as any);

    await expect(fundingGoals.getCrowStats('hour')).rejects.toThrow(
      'HTTP request failed while retrieving stats data, status code: 500'
    );
  });
});
