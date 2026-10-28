import { HttpClient } from '@/http-client';
import { RSIError } from '@/errors';
import { createLogger } from '@/logger';
import
{
  RSIFundingGoals, RSIFundingGoalsResponse, RSIFundingGoalsTimePeriod
} from './interfaces';


/**
 * Stats class for retrieving Star Citizen game stats
 * @see https://robertsspaceindustries.com/en/funding-goals
 */
export class FundingGoals
{
  private readonly urlCrowStat = 'https://robertsspaceindustries.com/api/stats/getCrowdfundStats';
  private readonly httpClient: HttpClient;
  private readonly logger = createLogger(FundingGoals.name);

  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  /**
   * Get crowdfunding stats
   * @param chart - Chart type, e.g., 'hour', 'day', 'week', 'month'
   * @returns Crowdfunding stats
   */
  public async getCrowdfundingStats(chart: RSIFundingGoalsTimePeriod): Promise<RSIFundingGoals>
  {
    this.logger.info('Fetching crowdfunding statistics', { chart });

    const data = {
      alpha_slots: true,
      chart: chart,
      fans: true,
      fleet: true,
      funds: true,
    };

    const response = await this.httpClient.post<RSIFundingGoalsResponse>(this.urlCrowStat, data);

    if (response.status !== 200)
      throw new RSIError(`HTTP request failed while retrieving stats data, status code: ${response.status}`);

    if (response.data.success !== 1)
      throw new RSIError(`Query failed from RSI (${response.data.msg})`);

    return response.data.data;
  }
}
