export type RSITelemetryResponse = {
  success: number;
  code: number;
  data?: RSITelemetryInfo | null;
  msg: string;
};

export type RSITelemetryInfo = {
  readonly current: RSICurrent;
  readonly past: unknown;
  [property: string]: unknown;
};

export type RSICurrent = {
  readonly doc_count: number;
  readonly last_updated_at: number;
  readonly latency_avg: RSILatencyAvg;
  readonly load_times_hdd: RSILoadTimesHDD;
  readonly load_times_ssd: RSILoadTimesSSD;
  readonly popular_resolutions: Array<number[]>;
  readonly stability_score: number;
  [property: string]: unknown;
};

export type RSILatencyAvg = {
  readonly value: number;
  [property: string]: unknown;
};

export type RSILoadTimesHDD = {
  readonly percent: number;
  readonly percentiles: { [key: string]: unknown; };
  readonly avg: unknown;
  readonly max: unknown;
  readonly min: unknown;
  [property: string]: unknown;
};

export type RSILoadTimesSSD = {
  readonly avg: number;
  readonly max: number;
  readonly min: number;
  readonly percent: number;
  readonly percentiles: { [key: string]: unknown; };
  [property: string]: unknown;
};
