export type StatsData = {
  fans: number;
  funds: number;
  fleet: number;
  current_live: string | null;
  current_ptu: string | null;
  current_etf: string | null;
}

export type CrowdStats = {
  fans: string;
  funds: string;
  fleet: string | null;
}
