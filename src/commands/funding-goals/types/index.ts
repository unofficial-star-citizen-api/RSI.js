export type RSIFundingGoalsData = {
  readonly success: number;
  readonly code: string;
  readonly msg: string;
  readonly data: RSIData;
};

export type RSIData = {
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
