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
