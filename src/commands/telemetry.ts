import { BaseCommand } from '@interfaces';
import { Connector } from '@services';
import { TelemetryData } from '../types';

/**
 * Telemetry class for retrieving Star Citizen telemetry data
 */
export class Telemetry extends BaseCommand<TelemetryData> {
  private readonly urlTelemetry = "https://robertsspaceindustries.com/api/telemetry/v2/community/";
  private readonly timetable: string;
  private readonly version: string;
  private connector: Connector;

  /**
   * @param timetable - "DAY", "WEEK", "MONTH"
   * @param version - The Star Citizen game version
   */
  constructor(timetable: string, version: string) {
    super();
    this.timetable = timetable;
    this.version = version;
    this.connector = new Connector();
  }

  /**
   * Execute the command to retrieve telemetry data
   */
  public async execute(): Promise<TelemetryData | null> {
    const query = `?&timetable=${this.timetable}&branch=sc-alpha-${this.version}`;

    const req = await this.connector.request<{
      success: number;
      data?: TelemetryData;
    }>(this.urlTelemetry + query, null, {}, 'get');

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
