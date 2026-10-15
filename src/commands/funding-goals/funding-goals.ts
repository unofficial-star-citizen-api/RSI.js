import { HttpClient } from '@/http-client';
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
    const data = {
      alpha_slots: true,
      chart: chart,
      fans: true,
      fleet: true,
      funds: true,
    };

    const response = await this.httpClient.post<RSIFundingGoalsResponse>(this.urlCrowStat, data);

    if (response.status !== 200)
      throw new Error(`HTTP request failed while retrieving stats data, status code: ${response.status}`);

    if (response.data.success !== 1)
      throw new Error(`Query failed from RSI (${response.data.msg})`);

    return response.data.data;
  }
}
