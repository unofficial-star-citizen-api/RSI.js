/** @internal */
export type RSITelemetryResponse = {
  success: number;
  code: number;
  data?: RSITelemetry | null;
  msg: string;
};

export type RSITelemetry = {
  readonly current: RSITelemetryCurrent;
  readonly past: unknown;
  [property: string]: unknown;
};

export type RSITelemetryCurrent = {
  readonly doc_count: number;
  readonly last_updated_at: number;
  readonly latency_avg: RSITelemetryLatencyAvg;
  readonly load_times_hdd: RSITelemetryLoadTimesHDD;
  readonly load_times_ssd: RSITelemetryLoadTimesSSD;
  readonly popular_resolutions: Array<number[]>;
  readonly stability_score: number;
  [property: string]: unknown;
};

export type RSITelemetryLatencyAvg = {
  readonly value: number;
  [property: string]: unknown;
};

export type RSITelemetryLoadTimesHDD = {
  readonly percent: number;
  readonly percentiles: { [key: string]: unknown; };
  readonly avg: unknown;
  readonly max: unknown;
  readonly min: unknown;
  [property: string]: unknown;
};

export type RSITelemetryLoadTimesSSD = {
  readonly avg: number;
  readonly max: number;
  readonly min: number;
  readonly percent: number;
  readonly percentiles: { [key: string]: unknown; };
  [property: string]: unknown;
};
