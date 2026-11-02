/** @internal */
export interface RSIFundingGoalsResponse
{
  readonly success: number;
  readonly code: string;
  readonly msg: string;
  readonly data: RSIFundingGoals;
}

/**
 * Crowdfunding stats, returned by {@link FundingGoals.getCrowdfundingStats}.
 *
 * @category Types/Funding goals
 */
export interface RSIFundingGoals
{
  /** Funding chart, keyed by period label (for example a date) */
  readonly chart: { [key: string]: RSIFundingGoalsChart; };
  /** Number of fans (registered accounts) */
  readonly fans: number;
  /** Total funds raised, as reported by RSI */
  readonly funds: number;
  /** Fleet size, or `null` when RSI does not report it */
  readonly fleet: number | null;
  /** Remaining Alpha slots */
  readonly alpha_slots_left: number;
};

/**
 * One point of the funding chart.
 *
 * @category Types/Funding goals
 */
export interface RSIFundingGoalsChart
{
  /** Funds raised during the period, as a numeric string */
  readonly gross: string;
  /** Axis label of the period, for example a date */
  readonly axis: string;
};

/**
 * Chart granularity for {@link FundingGoals.getCrowdfundingStats}.
 *
 * @category Types/Funding goals
 */
export enum RSIFundingGoalsTimePeriod
{
  Hour = 'hour',
  Day = 'day',
  Week = 'week',
  Month = 'month'
}