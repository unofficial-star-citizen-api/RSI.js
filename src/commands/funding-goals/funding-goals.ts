import { HttpClient } from '@/http-client';
import { RSIError } from '@/errors';
import { createLogger } from '@/logger';
import
{
  RSIFundingGoals, RSIFundingGoalsResponse, RSIFundingGoalsTimePeriod
} from './interfaces';


/**
 * Crowdfunding stats: funds raised, fans, fleet size and Alpha slots.
 * Access it through {@link RSI.fundingGoals}.
 *
 * @category Commands
 * @hideconstructor
 * @see https://robertsspaceindustries.com/en/funding-goals
 */
export class FundingGoals
{
  private readonly urlCrowStat = 'https://robertsspaceindustries.com/api/stats/getCrowdfundStats';
  private readonly httpClient: HttpClient;
  private readonly logger = createLogger(FundingGoals.name);

  /** @hidden */
  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  /**
   * Get the crowdfunding totals and the funding chart for a period.
   *
   * @param chart - Chart granularity: hour, day, week or month
   * @returns Funds, fans, fleet, Alpha slots left and the funding chart
   * @throws {@link RSIError} if RSI answers with a non-200 status or an unsuccessful payload
   *
   * @example
   * ```typescript
   * import { RSI, RSIFundingGoalsTimePeriod } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   * const stats = await rsi.fundingGoals.getCrowdfundingStats(RSIFundingGoalsTimePeriod.Day);
   *
   * console.log(stats.funds, stats.fans);
   * for (const [date, point] of Object.entries(stats.chart))
   *   console.log(date, point.gross);
   * ```
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
