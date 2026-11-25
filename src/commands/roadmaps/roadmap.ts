import { HttpClient } from '@/http-client';
import { RSIError, RSIHttpError } from '@/errors';
import { createLogger } from '@/logger';
import
{
  RSIRoadmap,
  RSIRoadmapBoard,
  RSIRoadmapBoardSummary,
  RSIRoadmapImage,
  RSIRoadmapInitResponse,
  RSIRoadmapResponse,
  RSIRoadmapThumbnail
} from './interfaces';

/**
 * Roadmap boards of Star Citizen and Squadron 42, and their releases.
 * Access it through {@link RSI.roadmaps}.
 *
 * @category Commands
 * @hideconstructor
 * @see https://robertsspaceindustries.com/roadmap/release-view
 */
export class Roadmaps
{
  private readonly urlRoadmapSC = 'https://robertsspaceindustries.com/api/roadmap/v1/boards/1';
  private readonly urlRoadmapS42 = 'https://robertsspaceindustries.com/api/roadmap/v1/boards/2';
  private readonly urlInit = 'https://robertsspaceindustries.com/api/roadmap/v1/init';
  private readonly httpClient: HttpClient;
  private readonly logger = createLogger(Roadmaps.name);

  /** Board IDs used by the roadmap API, for each {@link RSIRoadmapBoard} */
  private static readonly boardIds: Record<number, RSIRoadmapBoard> = {
    1: RSIRoadmapBoard.StarCitizen,
    2: RSIRoadmapBoard.Squadron42
  };

  /** @hidden */
  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  /**
   * Get every roadmap board with its name, description and images, without its releases.
   *
   * The Star Citizen board description announces the current game versions; it is returned
   * as-is, in Markdown.
   *
   * @returns The boards, in display order
   * @throws {@link RSIHttpError} if RSI cannot be reached or answers with a non-200 status
   * @throws {@link RSIError} if RSI answers with an unsuccessful payload
   *
   * @example
   * ```typescript
   * import { RSI, RSIRoadmapBoard } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   * const boards = await rsi.roadmaps.getBoards();
   *
   * const sc = boards.find(board => board.board === RSIRoadmapBoard.StarCitizen);
   * console.log(sc?.description); // Live Version: 4.10.3 ([more info](...)) ▪ Latest Roadmap Roundup: 11/18/2026 (...)
   * ```
   */
  public async getBoards(): Promise<RSIRoadmapBoardSummary[]>
  {
    this.logger.info('Fetching roadmap boards');

    const response = await this.httpClient.get<RSIRoadmapInitResponse>(this.urlInit);
    if (response.status !== 200)
      throw new RSIHttpError(`HTTP request failed while retrieving roadmap boards, status code: ${response.status}`, response.status, this.urlInit);

    if (response.data?.success !== 1)
      throw new RSIError(`Query failed from RSI (${response.data?.msg})`);

    const boards = response.data.data?.boards;
    if (!Array.isArray(boards))
      throw new RSIError('Roadmap API returned no boards');

    return boards
      .map(board => ({
        meta: {
          url: `${HttpClient.host}/roadmap/board/${board.id}-${board.url_slug}`
        },
        id: board.id,
        board: Roadmaps.boardIds[board.id],
        slug: board.url_slug,
        name: board.name,
        description: board.description || undefined,
        body: board.body || undefined,
        order: board.order,
        infoHeading: board.info_heading || undefined,
        notification: {
          enabled: board.notification_enabled,
          title: board.notification_title?.trim() || undefined,
          body: board.notification_body?.trim() || undefined
        },
        thumbnail: this.toImage(board.thumbnail),
        background: this.toImage(board.background),
        lastUpdated: board.last_updated ? new Date(board.last_updated * 1000).toISOString() : undefined
      }))
      .sort((a, b) => a.order - b.order);
  }

  private toImage(thumbnail: RSIRoadmapThumbnail | null): RSIRoadmapImage | undefined
  {
    if (!thumbnail?.urls)
      return undefined;

    return {
      square: HttpClient.toAbsoluteUrl(thumbnail.urls.square || undefined),
      rect: HttpClient.toAbsoluteUrl(thumbnail.urls.rect || undefined),
      large: HttpClient.toAbsoluteUrl(thumbnail.urls.large || undefined),
      source: HttpClient.toAbsoluteUrl(thumbnail.urls.source || undefined)
    };
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
      throw new RSIHttpError(`Failed to retrieve roadmap data for board: ${board}`, request?.status, request?.config?.url);
    }

    const response = request.data;
    if (response.success !== 1 || !response.data || !response.data.releases)
    {
      throw new RSIError(`Invalid response from roadmap API for board: ${board}`);
    }

    return response.data;
  }
}
