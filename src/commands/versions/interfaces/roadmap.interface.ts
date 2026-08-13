/** @internal */
export interface RSIVersionRoadmapResponse
{
  readonly success: number;
  readonly code: string;
  readonly msg: string;
  readonly data: RSIVersionRoadmap;
}

export type RoadmapVersions = {
  live: string | null | undefined;
  ptu: string | null | undefined;
  etf: string | null | undefined;
};

export interface RSIVersionRoadmap
{
  readonly config: RSIVersionRoadmapConfig;
  readonly canEdit: boolean;
  readonly who: null;
  readonly boards: RSIVersionRoadmapBoard[];
}

export interface RSIVersionRoadmapBoard
{
  readonly id: number;
  readonly url_slug: string;
  readonly name: string;
  readonly description: string;
  readonly body: string;
  readonly order: number;
  readonly thumbnail: RSIVersionRoadmapThumbnail;
  readonly background: RSIVersionRoadmapThumbnail | null;
  readonly importer_id: string;
  readonly info_heading: string;
  readonly notification_title: string;
  readonly notification_body: string;
  readonly notification_enabled: boolean;
  readonly last_updated: number;
}

export interface RSIVersionRoadmapThumbnail
{
  readonly id: number;
  readonly urls: RSIVersionRoadmapUrls;
}

export interface RSIVersionRoadmapUrls
{
  readonly square: string;
  readonly rect: string;
  readonly large: string;
  readonly source: string;
}

export interface RSIVersionRoadmapConfig
{
  readonly events_url: string;
  readonly home_url: string;
  readonly ga_tracking_id: string;
  readonly session_name: null;
}
