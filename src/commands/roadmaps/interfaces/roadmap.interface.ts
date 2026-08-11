/** @internal */
export interface RSIRoadmapResponse
{
  success: number;
  code: string;
  msg: string;
  data: RSIRoadmap;
}

export enum RSIRoadmapBoard
{
  StarCitizen = 'starcitizen',
  Squadron42 = 'squadron42'
}

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
  releases: RSIRoadmapRelease[];
  categories: RSIRoadmapCategory[];
  tags: unknown[];
  chapters: RSIRoadmapChapter[];
  last_updated: number;
  empty_release: string;
}

export interface RSIRoadmapThumbnail
{
  id: number;
  urls: RSIRoadmapThumbnailUrls;
}

export interface RSIRoadmapThumbnailUrls
{
  square: string;
  rect: string;
  large: string;
  source: string;
}

export interface RSIRoadmapCategory
{
  id: number;
  board_id: number;
  name: string;
  order: number;
}

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

export enum RSIRoadmapChapterStatus
{
  Greybox = 'Greybox',
  WhiteboxNarrative = 'Whitebox Narrative',
  WhiteboxPlayable = 'Whitebox Playable',
}

export interface RSIRoadmapRelease
{
  id: number;
  url_slug: string;
  time_created: number;
  time_modified: number;
  name: string;
  description: null | string;
  board_id: number;
  scheduled_at: null;
  order: number;
  released: number;
  status: RSIRoadmapCardStatus;
  importer_id: string;
  patch_announcement_link: null | string;
  cards: RSIRoadmapCard[];
}

export interface RSIRoadmapCard
{
  id: number;
  url_slug: string;
  time_created: number;
  time_modified: number;
  board_id: number;
  name: string;
  scheduled_at: null;
  release_id: number;
  category_id: number;
  importer_id: string;
  description: null | string;
  body: null | string;
  order: number;
  thumbnail: RSIRoadmapThumbnail | null;
  status: RSIRoadmapCardStatus;
  released: number;
  deliverable?: RSIRoadmapDeliverable;
  teams?: { [key: string]: RSIRoadmapTeam; };
}

export interface RSIRoadmapDeliverable
{
  title: string;
  slug: string;
}

export enum RSIRoadmapCardStatus
{
  Committed = 'Committed',
  Empty = '',
  Released = 'Released',
  Tentative = 'Tentative',
}

export interface RSIRoadmapTeam
{
  slug: string;
  title: string;
  abbreviation: string;
  description: string;
}