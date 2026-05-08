import { HttpClient } from '@/http-client';
import { RSITelemetryResponse } from './types';

type VersionNumber = '3.12' | '3.13' | '3.14'
  | '3.15' | '3.16' | '3.17'
  | '3.18' | '3.19' | '3.20'
  | '3.21' | '3.22' | '3.23'
  | '3.24' | '4.0';


export type TelemetryTimetable = 'DAY' | 'WEEK' | 'MONTH';
export type TelemetryVersion = `sc-alpha-${VersionNumber}`;

/**
 * Telemetry class for retrieving Star Citizen telemetry data
 * @see https://robertsspaceindustries.com/en/telemetry
 */
export class Telemetry
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
    const query = `?&timetable=${timetable}&branch=${version}`;

    const response = await this.httpClient.get<RSITelemetryResponse>(this.urlTelemetry + query);

    if (response.status !== 200)
      throw new Error(`HTTP request failed while retrieving telemetry data, status code: ${response.status}`);

    return response.data;
  }
}
