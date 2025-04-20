export type TelemetryResponse = {
  success: number;
  code: number;
  data?: TelemetryInfo | null;
  msg: string;
};

export type TelemetryInfo = {
  readonly current: Current;
  readonly past: unknown;
  [property: string]: unknown;
};

export type Current = {
  readonly doc_count: number;
  readonly last_updated_at: number;
  readonly latency_avg: LatencyAvg;
  readonly load_times_hdd: LoadTimesHDD;
  readonly load_times_ssd: LoadTimesSSD;
  readonly popular_resolutions: Array<number[]>;
  readonly stability_score: number;
  [property: string]: unknown;
};

export type LatencyAvg = {
  readonly value: number;
  [property: string]: unknown;
};

export type LoadTimesHDD = {
  readonly percent: number;
  readonly percentiles: { [key: string]: unknown; };
  readonly avg: unknown;
  readonly max: unknown;
  readonly min: unknown;
  [property: string]: unknown;
};

export type LoadTimesSSD = {
  readonly avg: number;
  readonly max: number;
  readonly min: number;
  readonly percent: number;
  readonly percentiles: { [key: string]: unknown; };
  [property: string]: unknown;
};
