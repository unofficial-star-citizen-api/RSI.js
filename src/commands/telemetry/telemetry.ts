import { HttpClient } from '../../http-client';
import { TelemetryData } from '../../types';

/**
 * Telemetry class for retrieving Star Citizen telemetry data
 */
export class Telemetry {
  private readonly urlTelemetry = "https://robertsspaceindustries.com/api/telemetry/v2/community/";
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * @param timetable - "DAY", "WEEK", "MONTH"
   * @param version - The Star Citizen game version
   */
  public async search(timetable: string, version: string): Promise<TelemetryData | null> {
    const query = `?&timetable=${timetable}&branch=sc-alpha-${version}`;

    const req = await this.httpClient.get<{
      success: number;
      data?: TelemetryData;
    }>(this.urlTelemetry + query);

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
