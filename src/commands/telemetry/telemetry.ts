import { HttpClient } from '../../http-client';
import { TelemetryInfo, TelemetryResponse } from './types'

type VersionNumber = '3.12' | '3.13' | '3.14'
  | '3.15' | '3.16' | '3.17'
  | '3.18' | '3.19' | '3.20'
  | '3.21' | '3.22' | '3.23'
  | '3.24' | '4.0';


export type TelemetryTimetable = 'DAY'|'WEEK'|'MONTH';
export type TelemetryVersion = `sc-alpha-${VersionNumber}`;

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
   * Retrieve telemetry data from the community API
   * @param timetable The time interval to retrieve data for
   * @param version The Star Citizen version to retrieve data for
   * @returns TelemetryInfo
   */
  public async community(timetable: TelemetryTimetable, version: TelemetryVersion): Promise<TelemetryInfo> {
    const query = `?&timetable=${timetable}&branch=${version}`;

    const response = await this.httpClient.get<TelemetryResponse>(this.urlTelemetry + query);

    if (response === null || response.status !== 200) {
      throw new Error(`HTTP request failed while retrieving telemetry data, status code: ${response.status}`);
    }

    // Check response
    if(response.data == null)
      throw new Error('An error occurred while retrieving telemetry data');

    if (response.data.success !== 1 )
      throw new Error(`Error code: ${response.data.code}, Message: ${response.data.msg}`);

    if(response.data.data == null)
      throw new Error('No telemetry data available');

    return response.data.data;
  }
}
