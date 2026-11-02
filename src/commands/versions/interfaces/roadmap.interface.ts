/** @internal */
export interface RSIVersionRoadmapResponse
{
  readonly success: number;
  readonly code: string;
  readonly msg: string;
  readonly data: RSIVersionRoadmap;
}

/**
 * Game versions announced on the RSI roadmap, returned by {@link VersionsRoadmap.getVersions}.
 * A channel is `null` when the roadmap does not announce it.
 *
 * @category Types/Versions
 */
export type RoadmapVersions = {
  /** Version on the LIVE servers, for example `4.0.1` */
  live: string | null | undefined;
  /** Version on the PTU, for example `4.0.2`; `null` while the PTU build is in ETF/Evocati testing */
  ptu: string | null | undefined;
  /** Version in ETF/Evocati testing, for example `4.1.0` */
  etf: string | null | undefined;
};

/**
 * Raw roadmap API type, not returned by any method.
 * @hidden
 */
export interface RSIVersionRoadmap
{
  readonly config: RSIVersionRoadmapConfig;
  readonly canEdit: boolean;
  readonly who: null;
  readonly boards: RSIVersionRoadmapBoard[];
}

/**
 * Raw roadmap API type, not returned by any method.
 * @hidden
 */
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

/**
 * Raw roadmap API type, not returned by any method.
 * @hidden
 */
export interface RSIVersionRoadmapThumbnail
{
  readonly id: number;
  readonly urls: RSIVersionRoadmapUrls;
}

/**
 * Raw roadmap API type, not returned by any method.
 * @hidden
 */
export interface RSIVersionRoadmapUrls
{
  readonly square: string;
  readonly rect: string;
  readonly large: string;
  readonly source: string;
}

/**
 * Raw roadmap API type, not returned by any method.
 * @hidden
 */
export interface RSIVersionRoadmapConfig
{
  readonly events_url: string;
  readonly home_url: string;
  readonly ga_tracking_id: string;
  readonly session_name: null;
}
