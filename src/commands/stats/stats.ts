import { HttpClient } from '../../http-client';
import { StatsData, CrowdStats } from '../../types';

/**
 * Stats class for retrieving Star Citizen stats
 */
export class Stats {
  private readonly urlCrowStat = "https://robertsspaceindustries.com/api/stats/getCrowdfundStats";
  private readonly urlRoadmap = "https://robertsspaceindustries.com/api/roadmap/v1/init";
  private readonly regexApiLive = /(live\s*version\s*:\s*(?<live_api>(\d+(\.\d+)*))?)/i;
  private readonly regexApiPtu = /(ptu\s*version\s*:\s*(?<ptu_version>(\d+(\.\d+)*))?)/i;
  private readonly regexApiEtf = /(ptu\s*version\s*:\s*(?<etf_version>(\d+(\.\d+)*)(.*?)((ETF)|(Evocati))))/i;
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Execute the command to retrieve game stats
   */
  public async search(): Promise<StatsData | null> {
    // Get stats info
    const stats = await this.__getCrowStats();
    if (stats === null) {
      return null;
    }

    let fleet: number | null = null;
    if (stats.fleet !== null) {
      fleet = parseInt(stats.fleet, 10);
    }

    const req = await this.httpClient.get<string>(this.urlRoadmap);
    if (req === null || req.status !== 200) {
      return null;
    }

    const text = req.data;
    const livePu = this.__getLivePu(text);
    const livePtu = this.__getLivePtu(text);
    const liveEtf = this.__getLiveEtf(text);

    return {
      fans: parseInt(stats.fans, 10),
      funds: parseFloat(stats.funds) / 100,
      fleet: fleet || 0,
      current_live: livePu,
      current_ptu: livePtu,
      current_etf: liveEtf,
    };
  }

  private __getLivePu(text: string): string | null {
    const match = this.regexApiLive.exec(text);
    if (match && match.groups) {
      return match.groups.live_api;
    }
    return null;
  }

  private __getLivePtu(text: string): string | null {
    const match = this.regexApiPtu.exec(text);
    if (match && match.groups) {
      return match.groups.ptu_version;
    }
    return null;
  }

  private __getLiveEtf(text: string): string | null {
    const match = this.regexApiEtf.exec(text);
    if (match && match.groups) {
      return match.groups.etf_version;
    }
    return null;
  }

  /**
   * Get all Crow stats
   * @param chart - Chart type
   * @returns Associative array of stats
   */
  private async __getCrowStats(chart: string = "day"): Promise<CrowdStats | null> {
    const data = {
      alpha_slots: true,
      chart: chart,
      fans: true,
      fleet: true,
      funds: true,
    };

    const req = await this.httpClient.post<{
      success: number;
      data?: CrowdStats;
    }>(this.urlCrowStat, data);

    if (req === null || req.status !== 200) {
      return null;
    }

    const resp = req.data;

    // Check response
    if (resp.success !== 1 || !resp.data) {
      return null;
    }

    return resp.data;
  }
}
