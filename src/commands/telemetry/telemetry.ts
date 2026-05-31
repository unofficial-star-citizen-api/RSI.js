import { HttpClient } from '@/http-client';
import { RSITelemetryResponse } from './types';

type VersionNumber = `${number}.${number}`;
export type TelemetryTimetable = 'DAY' | 'WEEK' | 'MONTH';
export type TelemetryVersion = `sc-alpha-${VersionNumber}`;

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
  public async community(timetable: TelemetryTimetable, version: TelemetryVersion): Promise<RSITelemetryResponse>
  {
    const VALID_TIMETABLES: TelemetryTimetable[] = ['DAY', 'WEEK', 'MONTH'];
    if (!VALID_TIMETABLES.includes(timetable))
      throw new Error(`Invalid timetable value: "${timetable}"`);
    if (!/^sc-alpha-\d+\.\d+$/.test(version))
      throw new Error(`Invalid version format: "${version}"`);
    const params = new URLSearchParams({ timetable, branch: version });

    const response = await this.httpClient.get<RSITelemetryResponse>(`${this.urlTelemetry}?${params}`);

    if (response.status !== 200)
      throw new Error(`HTTP request failed while retrieving telemetry data, status code: ${response.status}`);

    return response.data;
  }
}
