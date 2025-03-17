export type TelemetryResponse = {
  success: number
  code: number
  data?: TelemetryInfo | null
  msg: string
}

export type TelemetryInfo = {
  readonly current: Current
  readonly past: any;
  [property: string]: any
}

export type Current = {
  readonly doc_count: number
  readonly last_updated_at: number
  readonly latency_avg: LatencyAvg
  readonly load_times_hdd: LoadTimesHDD
  readonly load_times_ssd: LoadTimesSSD
  readonly popular_resolutions: Array<number[]>
  readonly stability_score: number;
  [property: string]: any
}

export type LatencyAvg = {
  readonly value: number;
  [property: string]: any
}

export type LoadTimesHDD = {
  readonly percent: number
  readonly percentiles: { [key: string]: any }
  readonly avg: any
  readonly max: any
  readonly min: any;
  [property: string]: any
}

export type LoadTimesSSD = {
  readonly avg: number
  readonly max: number
  readonly min: number
  readonly percent: number
  readonly percentiles: { [key: string]: any };
  [property: string]: any
}
