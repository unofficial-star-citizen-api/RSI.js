/** @internal */
export interface RSIRoadmapResponse
{
  success: number;
  code: string;
  msg: string;
  data: RSIRoadmap;
}

/**
 * Roadmap boards for {@link Roadmaps.getBoardReleases}.
 *
 * @category Roadmaps
 */
export enum RSIRoadmapBoard
{
  StarCitizen = 'starcitizen',
  Squadron42 = 'squadron42'
}

/**
 * A roadmap board with its releases, categories and chapters, returned by {@link Roadmaps.getBoardReleases}.
 *
 * Field names are kept as returned by the roadmap API (snake_case). Timestamps are Unix seconds.
 *
 * @category Roadmaps
 */
export interface RSIRoadmap
{
  id: number;
  url_slug: string;
  name: string;
  description: string;
  body: string;
  order: number;
  thumbnail: RSIRoadmapThumbnail;
  background: RSIRoadmapThumbnail | null;
  importer_id: string;
  info_heading: string;
  notification_title: string;
  notification_body: string;
  notification_enabled: boolean;
  /** Releases on the board, each with its cards */
  releases: RSIRoadmapRelease[];
  /** Card categories; match them with {@link RSIRoadmapCard.category_id} */
  categories: RSIRoadmapCategory[];
  tags: unknown[];
  /** Squadron 42 chapters; empty for Star Citizen */
  chapters: RSIRoadmapChapter[];
  /** Last update of the board, in Unix seconds */
  last_updated: number;
  empty_release: string;
}

/**
 * An image on the roadmap.
 *
 * @category Roadmaps
 */
export interface RSIRoadmapThumbnail
{
  id: number;
  urls: RSIRoadmapThumbnailUrls;
}

/**
 * Image URLs, one per format.
 *
 * @category Roadmaps
 */
export interface RSIRoadmapThumbnailUrls
{
  square: string;
  rect: string;
  large: string;
  source: string;
}

/**
 * A card category, such as Characters, Locations or Gameplay.
 *
 * @category Roadmaps
 */
export interface RSIRoadmapCategory
{
  id: number;
  board_id: number;
  name: string;
  order: number;
}

/**
 * A Squadron 42 chapter, with its stages.
 *
 * @category Roadmaps
 */
export interface RSIRoadmapChapter
{
  id: number;
  url_slug: string;
  time_created: number;
  time_modified: number;
  name: string;
  status?: RSIRoadmapChapterStatus;
  description: string;
  board_id: number;
  order: number;
  importer_id: string;
  thumbnail?: RSIRoadmapThumbnail;
  stages?: RSIRoadmapChapter[];
  release_id?: number;
  chapter_id?: number;
}

/**
 * Development status of a Squadron 42 chapter.
 *
 * @category Roadmaps
 */
export enum RSIRoadmapChapterStatus
{
  Greybox = 'Greybox',
  WhiteboxNarrative = 'Whitebox Narrative',
  WhiteboxPlayable = 'Whitebox Playable',
}

/**
 * A release (game version) on a roadmap board, with its cards.
 *
 * @category Roadmaps
 */
export interface RSIRoadmapRelease
{
  id: number;
  url_slug: string;
  time_created: number;
  time_modified: number;
  /** Release name, usually the game version, for example `4.0` */
  name: string;
  description: null | string;
  board_id: number;
  scheduled_at: null;
  order: number;
  /** `1` once the release is out, otherwise `0` */
  released: number;
  /** Release status */
  status: RSIRoadmapCardStatus;
  importer_id: string;
  /** Link to the patch announcement, once published */
  patch_announcement_link: null | string;
  /** Feature cards in this release */
  cards: RSIRoadmapCard[];
}

/**
 * A feature card in a release.
 *
 * @category Roadmaps
 */
export interface RSIRoadmapCard
{
  id: number;
  url_slug: string;
  time_created: number;
  time_modified: number;
  board_id: number;
  /** Feature name */
  name: string;
  scheduled_at: null;
  /** Identifier of the release the card belongs to */
  release_id: number;
  /** Identifier of the card category, see {@link RSIRoadmap.categories} */
  category_id: number;
  importer_id: string;
  description: null | string;
  body: null | string;
  order: number;
  thumbnail: RSIRoadmapThumbnail | null;
  /** Card status */
  status: RSIRoadmapCardStatus;
  /** `1` once the feature is released, otherwise `0` */
  released: number;
  /** Linked progress tracker deliverable, if any */
  deliverable?: RSIRoadmapDeliverable;
  /** Teams working on the card, keyed by team slug */
  teams?: { [key: string]: RSIRoadmapTeam; };
}

/**
 * Progress tracker deliverable linked to a card.
 *
 * @category Roadmaps
 */
export interface RSIRoadmapDeliverable
{
  title: string;
  slug: string;
}

/**
 * Status of a release or card.
 *
 * @category Roadmaps
 */
export enum RSIRoadmapCardStatus
{
  Committed = 'Committed',
  Empty = '',
  Released = 'Released',
  Tentative = 'Tentative',
}

/**
 * A development team working on a card.
 *
 * @category Roadmaps
 */
export interface RSIRoadmapTeam
{
  slug: string;
  title: string;
  abbreviation: string;
  description: string;
}