/**
 * Release channel of a game version.
 *
 * @category Types/Versions
 */
export enum RSISpectrumEnvironment
{
  Live = 'live',
  PTU = 'ptu',
  ETF = 'etf'
}

/**
 * A game version announced in a Spectrum patch-note thread, returned by {@link VersionsSpectrum}.
 *
 * @category Types/Versions
 */
export interface RSISpectrumVersion
{
  /** Version found in the thread title, for example `3.22.0` */
  name: string | undefined;
  /**
   * Release channel. Threads that mention neither LIVE nor ETF/Evocati are reported as PTU.
   */
  environment: RSISpectrumEnvironment | undefined;
  /** PTU wave, only set for PTU versions */
  group?: RSISpectrumGroups | undefined;
}

/**
 * A PTU version announced on Spectrum, with its wave.
 *
 * @category Types/Versions
 */
export interface RSISpectrumVersionPtu
{
  /** Version found in the thread title */
  name: string | undefined;
  /** Always {@link RSISpectrumEnvironment.PTU} */
  environment: RSISpectrumEnvironment.PTU;
  /** PTU wave the version is open to */
  group: RSISpectrumGroups | undefined;
}

/**
 * PTU waves. `ALL` means the PTU is open to every backer.
 *
 * @category Types/Versions
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
