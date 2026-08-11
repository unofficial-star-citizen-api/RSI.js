import { HttpClient } from '@/http-client';
import { RSITelemetry, RSITelemetryResponse, TelemetryTimetable, TelemetryVersion } from './types';

/**
 * Telemetry class for retrieving Star Citizen telemetry data
 * @see https://robertsspaceindustries.com/en/telemetry
 */
export class Telemetries
{
  private readonly urlTelemetry = 'https://robertsspaceindustries.com/api/telemetry/v2/community/';
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  /**
   * Retrieve telemetry data from the community API
   * @param timetable The time interval to retrieve data for
   * @param version The Star Citizen version to retrieve data for
   * @returns TelemetryInfo
   */
  public async community(timetable: TelemetryTimetable, version: TelemetryVersion): Promise<RSITelemetry | null>
  {
    const VALID_TIMETABLES = Object.values(TelemetryTimetable);
    if (!VALID_TIMETABLES.includes(timetable))
      throw new Error(`Invalid timetable value: "${timetable}"`);

    if (!/^sc-alpha-\d+\.\d+$/.test(version))
      throw new Error(`Invalid version format: "${version}"`);

    const params = new URLSearchParams({ timetable, branch: version });

    const response = await this.httpClient.get<RSITelemetryResponse>(`${this.urlTelemetry}?${params}`);

    if (response.status !== 200)
      throw new Error(`HTTP request failed while retrieving telemetry data, status code: ${response.status}`);

    return response.data.data ?? null;
  }
}
