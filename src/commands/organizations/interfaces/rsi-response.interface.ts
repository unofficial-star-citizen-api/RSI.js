/** @internal */
export interface RSIOrganizationResponse
{
  readonly success: number;
  readonly code: string;
  readonly msg: string;
  readonly data: RSIOrganizationResponseData;
}

/** @internal */
export interface RSIOrganizationResponseData
{
  readonly totalrows: number;
  readonly html: string;
}
