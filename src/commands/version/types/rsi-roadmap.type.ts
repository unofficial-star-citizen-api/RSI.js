export type RSIRoadmap = {
  readonly success: number;
  readonly code: string;
  readonly msg: string;
  readonly data: Data;
};

export type Data = {
  readonly config: Config;
  readonly canEdit: boolean;
  readonly who: null;
  readonly boards: Board[];
};

export type Board = {
  readonly id: number;
  readonly url_slug: string;
  readonly name: string;
  readonly description: string;
  readonly body: string;
  readonly order: number;
  readonly thumbnail: Thumbnail;
  readonly background: Thumbnail | null;
  readonly importer_id: string;
  readonly info_heading: string;
  readonly notification_title: string;
  readonly notification_body: string;
  readonly notification_enabled: boolean;
  readonly last_updated: number;
};

export type Thumbnail = {
  readonly id: number;
  readonly urls: Urls;
};

export type Urls = {
  readonly square: string;
  readonly rect: string;
  readonly large: string;
  readonly source: string;
};

export type Config = {
  readonly events_url: string;
  readonly home_url: string;
  readonly ga_tracking_id: string;
  readonly session_name: null;
};
