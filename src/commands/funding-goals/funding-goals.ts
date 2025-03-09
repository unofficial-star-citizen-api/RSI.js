import { HttpClient } from '../../http-client';
import { FundingGoalsData } from '../../types';

export type FoundingGoalChart = 'hour' | 'day' | 'week' | 'month';

/**
 * Stats class for retrieving Star Citizen game stats
 * @see https://robertsspaceindustries.com/en/funding-goals
 */
export class FundingGoals {
  private readonly urlCrowStat = 'https://robertsspaceindustries.com/api/stats/getCrowdfundStats';
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Get all Crow stats
   * @param chart - Chart type
   * @returns Associative array of stats
   */
  public async getCrowStats(chart: FoundingGoalChart): Promise<FundingGoalsData> {
    const data = {
      alpha_slots: true,
      chart: chart,
      fans: true,
      fleet: true,
      funds: true,
    };

    const response = await this.httpClient.post<FundingGoalsData>(this.urlCrowStat, data);

    if (response === null || response.status !== 200) {
      throw new Error(`HTTP request failed while retrieving stats data, status code: ${response.status}`);
    }

    return response.data;
  }
}
