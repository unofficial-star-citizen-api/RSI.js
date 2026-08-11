/** @internal */
export interface RSIFundingGoalsResponse
{
  readonly success: number;
  readonly code: string;
  readonly msg: string;
  readonly data: RSIFundingGoals;
}

export interface RSIFundingGoals
{
  readonly chart: { [key: string]: RSIFundingGoalsChart; };
  readonly fans: number;
  readonly funds: number;
  readonly fleet: null;
  readonly alpha_slots_left: number;
};

export interface RSIFundingGoalsChart
{
  readonly gross: string;
  readonly axis: string;
};

export enum RSIFundingGoalsTimePeriod
{
  Hour = 'hour',
  Day = 'day',
  Week = 'week',
  Month = 'month'
}