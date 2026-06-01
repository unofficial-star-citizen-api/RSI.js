export type RSIRoadmap = {
  readonly success: number;
  readonly code: string;
  readonly msg: string;
  readonly data: RSIRoadmapData;
};

export type RSIRoadmapData = {
  readonly config: RSIConfig;
  readonly canEdit: boolean;
  readonly who: null;
  readonly boards: RSIBoard[];
};

export type RSIBoard = {
  readonly id: number;
  readonly url_slug: string;
  readonly name: string;
  readonly description: string;
  readonly body: string;
  readonly order: number;
  readonly thumbnail: RSIThumbnail;
  readonly background: RSIThumbnail | null;
  readonly importer_id: string;
  readonly info_heading: string;
  readonly notification_title: string;
  readonly notification_body: string;
  readonly notification_enabled: boolean;
  readonly last_updated: number;
};

export type RSIThumbnail = {
  readonly id: number;
  readonly urls: RSIUrls;
};

export type RSIUrls = {
  readonly square: string;
  readonly rect: string;
  readonly large: string;
  readonly source: string;
};

export type RSIConfig = {
  readonly events_url: string;
  readonly home_url: string;
  readonly ga_tracking_id: string;
  readonly session_name: null;
};
