/** @internal */
export interface RSITelemetryResponse
{
  readonly success: number;
  readonly code: number;
  readonly data?: RSITelemetry | null;
  readonly msg: string;
}

/**
 * Aggregation period for {@link Telemetries.community}.
 *
 * @category Telemetry
 */
export enum RSITelemetryTimetable
{
  Day = 'DAY',
  Week = 'WEEK',
  Month = 'MONTH'
}

/**
 * Game branch for {@link Telemetries.community}, for example `sc-alpha-4.0`.
 *
 * @category Telemetry
 */
export type RSITelemetryVersion = `sc-alpha-${number}.${number}`;

/**
 * Community telemetry for a period, returned by {@link Telemetries.community}.
 *
 * @category Telemetry
 */
export interface RSITelemetry
{
  /** Stats for the requested period */
  readonly current: RSITelemetryCurrent;
  /** Stats for the previous period of the same length */
  readonly past: RSITelemetryCurrent;
}

/**
 * Aggregated telemetry for one period.
 *
 * @category Telemetry
 */
export interface RSITelemetryCurrent
{
  /** Number of telemetry reports aggregated */
  readonly doc_count: number;
  /** Timestamp of the last update */
  readonly last_updated_at: number;
  /** Average latency */
  readonly latency_avg: RSITelemetryLatencyAvg;
  /** Load times on hard disk drives */
  readonly load_times_hdd: RSITelemetryLoadTimes;
  /** Load times on solid-state drives */
  readonly load_times_ssd: RSITelemetryLoadTimes;
  /** Most used screen resolutions, as `[width, height]` pairs */
  readonly popular_resolutions: Array<number[]>;
  /** Stability score reported by RSI */
  readonly stability_score: number;
}

/**
 * Average latency.
 *
 * @category Telemetry
 */
export interface RSITelemetryLatencyAvg
{
  /** Average latency value */
  readonly value: number;
}

/**
 * Load time distribution for one drive type.
 *
 * @category Telemetry
 */
export interface RSITelemetryLoadTimes
{
  /** Average load time */
  readonly avg: number;
  /** Longest load time */
  readonly max: number;
  /** Shortest load time */
  readonly min: number;
  /** Percentage reported by RSI for this drive type */
  readonly percent: number;
  /** Load time per percentile, keyed by percentile */
  readonly percentiles: { [key: string]: number; };
}
