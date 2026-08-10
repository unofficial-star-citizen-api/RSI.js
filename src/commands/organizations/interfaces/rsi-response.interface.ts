/** @internal */
export type RSIResponse = {
  readonly success: number;
  readonly code: string;
  readonly msg: string;
  readonly data: RSIData;
};

/** @internal */
export type RSIData = {
  readonly totalrows: number;
  readonly html: string;
};
