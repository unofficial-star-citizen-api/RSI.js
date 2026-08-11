export interface RSIRoadmap
{
  readonly success: number;
  readonly code: string;
  readonly msg: string;
  readonly data: RSIRoadmapData;
}

export interface RSIRoadmapData
{
  readonly config: RSIRoadmapConfig;
  readonly canEdit: boolean;
  readonly who: null;
  readonly boards: RSIRoadmapBoard[];
}

export interface RSIRoadmapBoard
{
  readonly id: number;
  readonly url_slug: string;
  readonly name: string;
  readonly description: string;
  readonly body: string;
  readonly order: number;
  readonly thumbnail: RSIRoadmapThumbnail;
  readonly background: RSIRoadmapThumbnail | null;
  readonly importer_id: string;
  readonly info_heading: string;
  readonly notification_title: string;
  readonly notification_body: string;
  readonly notification_enabled: boolean;
  readonly last_updated: number;
}

export interface RSIRoadmapThumbnail
{
  readonly id: number;
  readonly urls: RSIRoadmapUrls;
}

export interface RSIRoadmapUrls
{
  readonly square: string;
  readonly rect: string;
  readonly large: string;
  readonly source: string;
}

export interface RSIRoadmapConfig
{
  readonly events_url: string;
  readonly home_url: string;
  readonly ga_tracking_id: string;
  readonly session_name: null;
}
