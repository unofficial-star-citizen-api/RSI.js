import { HttpClient } from '@/http-client';
import { RSIFundingGoalsData } from './types';

export type RSIFoundingGoalChart = 'hour' | 'day' | 'week' | 'month';

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
   * Get all Crow stats
   * @param chart - Chart type
   * @returns Associative array of stats
   */
  public async getCrowStats(chart: RSIFoundingGoalChart): Promise<RSIFundingGoalsData>
  {
    const data = {
      alpha_slots: true,
      chart: chart,
      fans: true,
      fleet: true,
      funds: true,
    };

    const response = await this.httpClient.post<RSIFundingGoalsData>(this.urlCrowStat, data);

    if (response.status !== 200)
      throw new Error(`HTTP request failed while retrieving stats data, status code: ${response.status}`);

    return response.data;
  }
}
