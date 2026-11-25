import { RSIError } from '@/errors';
import { HttpClient } from '@/http-client';
import { createLogger } from '@/logger';
import { RSIRoadmapBoard, Roadmaps } from '../roadmaps';
import { RoadmapVersions } from './interfaces/roadmap.interface';

/**
 * Current game versions announced on the RSI roadmap. Access it through `rsi.versions.roadmap`.
 * Exported as `VersionsRoadmap`.
 *
 * Every method sends one request; call {@link VersionsRoadmap.getVersions} to get all channels at once.
 * The versions are read from the Star Citizen board description, see {@link Roadmaps.getBoards}.
 *
 * @category Commands
 * @hideconstructor
 * @see https://robertsspaceindustries.com/roadmap
 */
export class Roadmap
{
  // Versions such as "4.0.1", or "3.23.1a" for a hotfix, without trailing punctuation
  private readonly regexLive = /live\s*version\s*:\s*(\d+(?:\.\d+)+[a-z]?)/i;
  private readonly regexPTU = /PTU\s*Version\s*:\s*(\d+(?:\.\d+)+[a-z]?)(.*?)PTU/i;
  private readonly regexETF = /PTU\s*Version\s*:\s*(\d+(?:\.\d+)+[a-z]?)(.*?)(ETF|(Evocati))/i;

  private readonly roadmaps: Roadmaps;
  private readonly logger = createLogger(Roadmap.name);

  /** @hidden */
  constructor(httpClient: HttpClient)
  {
    this.roadmaps = new Roadmaps(httpClient);
  }

  /**
   * Get the LIVE, PTU and ETF versions announced on the Star Citizen roadmap board.
   *
   * @returns The version of each channel; a channel is `null` when it is not announced
   * @throws {@link RSIError} if RSI answers with a non-200 status or an unsuccessful payload
   *
   * @example
   * ```typescript
   * import { RSI } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   * const { live, ptu, etf } = await rsi.versions.roadmap.getVersions();
   *
   * console.log(live); // for example '4.0.1'
   * ```
   */
  public async getVersions(): Promise<RoadmapVersions>
  {
    this.logger.info('Fetching game version information');

    const board = (await this.roadmaps.getBoards()).find(board => board.board === RSIRoadmapBoard.StarCitizen);
    if (!board)
      throw new RSIError('The Star Citizen roadmap board is missing');

    const description = board.description ?? '';

    const live = this.regexLive.exec(description)?.at(1) ?? null;
    const etf = this.regexETF.exec(description)?.at(1) ?? null;
    const ptu = (etf == null)  // extract PTU if no ETF/evocati is defined
      ? this.regexPTU.exec(description)?.at(1) ?? null
      : null;

    return {
      live,
      ptu,
      etf
    };
  }

  /**
   * Get the version on the LIVE servers.
   *
   * @returns The LIVE version, or `null` if the roadmap does not announce it
   * @throws {@link RSIError} if RSI answers with a non-200 status or an unsuccessful payload
   *
   * @example
   * ```typescript
   * const live = await rsi.versions.roadmap.getLiveVersion(); // for example '4.0.1'
   * ```
   */
  public async getLiveVersion(): Promise<RoadmapVersions['live']>
  {
    return (await this.getVersions()).live;
  }

  /**
   * Get the version on the PTU.
   *
   * @returns The PTU version, or `null` if none is announced or the PTU build is in ETF/Evocati testing
   * @throws {@link RSIError} if RSI answers with a non-200 status or an unsuccessful payload
   *
   * @example
   * ```typescript
   * const ptu = await rsi.versions.roadmap.getPTUVersion(); // for example '4.0.2'
   * ```
   */
  public async getPTUVersion(): Promise<RoadmapVersions['ptu']>
  {
    return (await this.getVersions()).ptu;
  }

  /**
   * Get the version in ETF/Evocati testing.
   *
   * @returns The ETF version, or `null` if none is announced
   * @throws {@link RSIError} if RSI answers with a non-200 status or an unsuccessful payload
   *
   * @example
   * ```typescript
   * const etf = await rsi.versions.roadmap.getETFVersion(); // for example '4.1.0'
   * ```
   */
  public async getETFVersion(): Promise<RoadmapVersions['etf']>
  {
    return (await this.getVersions()).etf;
  }
}