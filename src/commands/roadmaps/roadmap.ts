import { HttpClient } from '@/http-client';
import { RSIError } from '@/errors';
import { createLogger } from '@/logger';
import
{
  RSIRoadmap,
  RSIRoadmapBoard,
  RSIRoadmapResponse
} from './interfaces';

/**
 * Release roadmaps of Star Citizen and Squadron 42.
 * Access it through {@link RSI.roadmaps}.
 *
 * @category Roadmaps
 * @see https://robertsspaceindustries.com/roadmap/release-view
 */
export class Roadmaps
{
  private readonly urlRoadmapSC = 'https://robertsspaceindustries.com/api/roadmap/v1/boards/1';
  private readonly urlRoadmapS42 = 'https://robertsspaceindustries.com/api/roadmap/v1/boards/2';
  private readonly httpClient: HttpClient;
  private readonly logger = createLogger(Roadmaps.name);

  /** @hidden */
  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  /**
   * Get a roadmap board with its releases, cards and statuses.
   *
   * @param board - Board to read: Star Citizen or Squadron 42
   * @returns The board and its releases
   * @throws Error if `board` is not a {@link RSIRoadmapBoard} value
   * @throws {@link RSIError} if RSI answers with a non-200 status or an invalid payload
   *
   * @example
   * ```typescript
   * import { RSI, RSIRoadmapBoard } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   * const sc = await rsi.roadmaps.getBoardReleases(RSIRoadmapBoard.StarCitizen);
   * const s42 = await rsi.roadmaps.getBoardReleases(RSIRoadmapBoard.Squadron42);
   *
   * for (const release of sc?.releases ?? [])
   *   console.log(release.name, release.cards.length);
   * ```
   */
  public async getBoardReleases(board: RSIRoadmapBoard): Promise<RSIRoadmap | null>
  {
    this.logger.info('Fetching roadmap releases', { board });

    let request;

    switch (board)
    {
    case RSIRoadmapBoard.StarCitizen:
      request = await this.httpClient.get<RSIRoadmapResponse>(this.urlRoadmapSC);
      break;
    case RSIRoadmapBoard.Squadron42:
      request = await this.httpClient.get<RSIRoadmapResponse>(this.urlRoadmapS42);
      break;
    default:
      throw new Error(`Invalid board: ${board}`);
    }

    if (request === null || request.status !== 200)
    {
      throw new RSIError(`Failed to retrieve roadmap data for board: ${board}`);
    }

    const response = request.data;
    if (response.success !== 1 || !response.data || !response.data.releases)
    {
      throw new RSIError(`Invalid response from roadmap API for board: ${board}`);
    }

    return response.data;
  }
}
