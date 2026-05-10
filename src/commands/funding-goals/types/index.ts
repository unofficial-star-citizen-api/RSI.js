export type RSIFundingGoalsResponse = {
  readonly success: number;
  readonly code: string;
  readonly msg: string;
  readonly data: RSIFundingGoalsData;
};

export type RSIFundingGoalsData = {
  readonly chart: { [key: string]: RSIChart; };
  readonly fans: number;
  readonly funds: number;
  readonly fleet: null;
  readonly alpha_slots_left: number;
};

export type RSIChart = {
  readonly gross: string;
  readonly axis: string;
};
