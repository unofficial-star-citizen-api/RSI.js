/** @internal */
export interface RSIResponse
{
  readonly success: number;
  readonly code: string;
  readonly msg: string;
  readonly data: RSIData;
}

/** @internal */
export interface RSIData
{
  readonly totalrows: number;
  readonly html: string;
}
