import type { RSIResourceMeta } from '@/types/resource-meta.interface';
import type { RSIRoadmapBoard } from './roadmap.interface';

/**
 * A roadmap board without its releases, returned by {@link Roadmaps.getBoards}.
 *
 * @category Types/Roadmaps
 */
export interface RSIRoadmapBoardSummary
{
  /** Resource metadata; `meta.url` is the board page */
  meta: RSIResourceMeta;
  /** Board ID: `1` for Star Citizen (Release View), `2` for Squadron 42 */
  id: number;
  /** Board to pass to {@link Roadmaps.getBoardReleases}, or `undefined` for a board it does not support */
  board: RSIRoadmapBoard | undefined;
  /** Short name used in URLs, for example `Release-View` */
  slug: string;
  /** Board name, for example `Release View` */
  name: string;
  /**
   * Short text shown under the board name, as Markdown. On the Star Citizen board it announces
   * the current versions, for example `Live Version: 4.10.3 ([more info](...)) ▪ Latest Roadmap Roundup: 11/18/2026`
   */
  description: string | undefined;
  /** Long explanation of the board, as Markdown */
  body: string | undefined;
  /** Display order of the board */
  order: number;
  /** Heading of the board's caveats section, for example `Roadmap: Caveats` */
  infoHeading: string | undefined;
  /** Notification banner shown on the board */
  notification: RSIRoadmapBoardNotification;
  /** Board logo */
  thumbnail: RSIRoadmapImage | undefined;
  /** Board background image */
  background: RSIRoadmapImage | undefined;
  /** Date of the last board update, as an ISO 8601 string */
  lastUpdated: string | undefined;
}

/**
 * Notification banner of a roadmap board.
 *
 * @category Types/Roadmaps
 */
export interface RSIRoadmapBoardNotification
{
  /** Whether the banner is shown */
  enabled: boolean;
  /** Banner title, for example `Roadmap Roundup for November 18, 2026` */
  title: string | undefined;
  /** Banner text, as Markdown */
  body: string | undefined;
}

/**
 * Absolute URLs of a roadmap image, one per format.
 *
 * @category Types/Roadmaps
 */
export interface RSIRoadmapImage
{
  /** Square crop */
  square: string | undefined;
  /** Rectangular crop */
  rect: string | undefined;
  /** Large version */
  large: string | undefined;
  /** Original upload */
  source: string | undefined;
}
