/** @internal */
export interface RSITelemetryResponse
{
  readonly success: number;
  readonly code: number;
  readonly data?: RSITelemetry | null;
  readonly msg: string;
}

export enum TelemetryTimetable
{
  Day = 'DAY',
  Week = 'WEEK',
  Month = 'MONTH'
}

type VersionNumber = `${number}.${number}`;
export type TelemetryVersion = `sc-alpha-${VersionNumber}`;

export interface RSITelemetry
{
  readonly current: RSITelemetryCurrent;
  readonly past: RSITelemetryCurrent;
}

export interface RSITelemetryCurrent
{
  readonly doc_count: number;
  readonly last_updated_at: number;
  readonly latency_avg: RSITelemetryLatencyAvg;
  readonly load_times_hdd: RSITelemetryLoadTimes;
  readonly load_times_ssd: RSITelemetryLoadTimes;
  readonly popular_resolutions: Array<number[]>;
  readonly stability_score: number;
}

export interface RSITelemetryLatencyAvg
{
  readonly value: number;
}

export interface RSITelemetryLoadTimes
{
  readonly avg: number;
  readonly max: number;
  readonly min: number;
  readonly percent: number;
  readonly percentiles: { [key: string]: number; };
}
