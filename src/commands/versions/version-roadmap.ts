
import { HttpClient } from '@/http-client';
import { RoadmapVersions, RSIVersionRoadmapResponse } from './interfaces/roadmap.interface';

export class Roadmap
{
  private readonly url = 'https://robertsspaceindustries.com/api/roadmap/v1/init';

  private readonly regexLive = /live\s*version\s*:\s*([^ ]*)/i;
  private readonly regexPTU = /PTU\s*Version\s*:\s*([^ ]*)(.*?)PTU/i;
  private readonly regexETF = /PTU\s*Version\s*:\s*([^ ]*)(.*?)(ETF|(Evocati))/i;

  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  public async getVersions(): Promise<RoadmapVersions>
  {
    const response = await this.httpClient.get<RSIVersionRoadmapResponse>(this.url);
    if (response.status !== 200)
      throw new Error(`HTTP request failed while retrieving roadmap data, status code: ${response.status}`);

    if (response.data.success !== 1)
      throw new Error(`Query failed from RSI (${response.data.msg})`);

    const description = response.data.data.boards
      .filter(board => board.id == 1)[0].description; // id '1' is for Star Citizen board

    const live = this.regexLive.exec(description)?.at(1) ?? null;
    const etf = this.regexETF.exec(description)?.at(1) ?? null;
    const ptu = (etf == null)  // extract PTU if no ETF/evocati is defined
      ? this.regexPTU.exec(description)?.at(1) ?? null
      : null;

    return {
      live,
      ptu,
      etf
    };
  }

  public async getLiveVersion(): Promise<RoadmapVersions['live']>
  {
    return (await this.getVersions()).live;
  }

  public async getPTUVersion(): Promise<RoadmapVersions['ptu']>
  {
    return (await this.getVersions()).ptu;
  }

  public async getETFVersion(): Promise<RoadmapVersions['etf']>
  {
    return (await this.getVersions()).etf;
  }
}