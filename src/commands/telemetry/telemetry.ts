import { HttpClient } from '@/http-client';
import { RSIError } from '@/errors';
import { createLogger } from '@/logger';
import
{
  RSITelemetry, RSITelemetryResponse, RSITelemetryTimetable, RSITelemetryVersion
} from './interfaces';

/**
 * Community telemetry: performance, load times and stability reported by players.
 * Access it through {@link RSI.telemetries}.
 *
 * @category Commands
 * @hideconstructor
 * @see https://robertsspaceindustries.com/en/telemetry
 */
export class Telemetries
{
  private readonly urlTelemetry = 'https://robertsspaceindustries.com/api/telemetry/v2/community/';
  private readonly httpClient: HttpClient;
  private readonly logger = createLogger(Telemetries.name);

  /** @hidden */
  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  /**
   * Get community telemetry for a game version over a period, compared with the previous period.
   *
   * @param timetable - Period to aggregate over: day, week or month
   * @param version - Game branch, in the form `sc-alpha-<major>.<minor>`, for example `sc-alpha-4.0`
   * @returns Stats for the current and the previous period, or `null` if RSI has no data
   * @throws Error if `timetable` is not a {@link RSITelemetryTimetable} value or `version` is malformed
   * @throws {@link RSIError} if RSI answers with a non-200 status
   *
   * @example
   * ```typescript
   * import { RSI, RSITelemetryTimetable } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   * const telemetry = await rsi.telemetries.community(RSITelemetryTimetable.Week, 'sc-alpha-4.0');
   *
   * console.log(telemetry?.current.stability_score, telemetry?.past.stability_score);
   * ```
   */
  public async community(timetable: RSITelemetryTimetable, version: RSITelemetryVersion): Promise<RSITelemetry | null>
  {
    const VALID_TIMETABLES = Object.values(RSITelemetryTimetable);
    if (!VALID_TIMETABLES.includes(timetable))
      throw new Error(`Invalid timetable value: "${timetable}"`);

    if (!/^sc-alpha-\d+\.\d+$/.test(version))
      throw new Error(`Invalid version format: "${version}"`);

    this.logger.info('Fetching community telemetry', { timetable, version });

    const params = new URLSearchParams({ timetable, branch: version });

    const response = await this.httpClient.get<RSITelemetryResponse>(`${this.urlTelemetry}?${params}`);

    if (response.status !== 200)
      throw new RSIError(`HTTP request failed while retrieving telemetry data, status code: ${response.status}`);

    return response.data.data ?? null;
  }
}
