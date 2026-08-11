/** @internal */
export type RSITelemetryResponse = {
  readonly success: number;
  readonly code: number;
  readonly data?: RSITelemetry | null;
  readonly msg: string;
};

export enum TelemetryTimetable
{
  Day = 'DAY',
  Week = 'WEEK',
  Month = 'MONTH'
}

type VersionNumber = `${number}.${number}`;
export type TelemetryVersion = `sc-alpha-${VersionNumber}`;

export type RSITelemetry = {
  readonly current: RSITelemetryCurrent;
  readonly past: RSITelemetryCurrent;
};

export type RSITelemetryCurrent = {
  readonly doc_count: number;
  readonly last_updated_at: number;
  readonly latency_avg: RSITelemetryLatencyAvg;
  readonly load_times_hdd: RSITelemetryLoadTimesHDD;
  readonly load_times_ssd: RSITelemetryLoadTimesSSD;
  readonly popular_resolutions: Array<number[]>;
  readonly stability_score: number;
};

export type RSITelemetryLatencyAvg = {
  readonly value: number;
};

export type RSITelemetryLoadTimesHDD = {
  readonly percent: number;
  readonly percentiles: { [key: string]: unknown; };
  readonly avg: unknown;
  readonly max: unknown;
  readonly min: unknown;
};

export type RSITelemetryLoadTimesSSD = {
  readonly avg: number;
  readonly max: number;
  readonly min: number;
  readonly percent: number;
  readonly percentiles: { [key: string]: unknown; };
};
