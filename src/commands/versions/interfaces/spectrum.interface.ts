export enum RSISpectrumEnvironment
{
  Live = 'live',
  PTU = 'ptu',
  ETF = 'etf'
}

export interface RSISpectrumVersion
{
  name: string | undefined;
  environment: RSISpectrumEnvironment | undefined;
  group?: RSISpectrumGroups | undefined;
}

export interface RSISpectrumVersionPtu
{
  name: string | undefined;
  environment: RSISpectrumEnvironment.PTU;
  group: RSISpectrumGroups | undefined;
}

/**
 * PTU Waves
 * @enum {number} Waves
 * @see https://support.robertsspaceindustries.com/hc/en-us/articles/115013195927-Public-Test-Universe-PTU-FAQ#h_01H9N5R5CT0W3RAF9VMRJSPKT5
 */
export enum RSISpectrumGroups
{
  GROUP_1 = 1,
  GROUP_2 = 2,
  GROUP_3 = 3,
  GROUP_4 = 4,
  ALL = 5,
}