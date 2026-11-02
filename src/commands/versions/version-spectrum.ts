// External modules
import { HttpClient } from '@/http-client';
import { RSIError } from '@/errors';
import { createLogger } from '@/logger';
import
{
  RSISpectrumEnvironment, RSISpectrumGroups, RSISpectrumVersion
} from './interfaces';
import { RSISpectrumThreadDataThread, RSISpectrumThreadResponse } from './interfaces/spectrum-thread.interface';

/**
 * Game versions announced in the Spectrum patch-notes channel, with their release channel and PTU wave.
 * Access it through `rsi.versions.spectrum`. Exported as `VersionsSpectrum`.
 *
 * Every method reads the newest page of threads in the channel.
 *
 * @category Commands
 * @hideconstructor
 */
export class Spectrum
{
  private readonly urlSpectrumPatchNotes = 'https://robertsspaceindustries.com/api/spectrum/forum/channel/threads';

  private readonly regexVersion = /(\d(\.\d+)+)\s?(\d+)?\s?(\w+)/;
  private readonly httpClient: HttpClient;
  private readonly logger = createLogger(Spectrum.name);

  /** @hidden */
  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  /**
   * Get the versions announced in the newest patch-note threads, on every channel.
   *
   * @returns One entry per thread, newest first
   * @throws {@link RSIError} if RSI answers with a non-200 status or an unsuccessful payload
   *
   * @example
   * ```typescript
   * import { RSI } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   * const versions = await rsi.versions.spectrum.get();
   *
   * console.log(versions.map(v => `${v.environment}: ${v.name}`)); // for example 'live: 3.22.0'
   * ```
   */
  public async get(): Promise<RSISpectrumVersion[]>
  {
    this.logger.info('Fetching Spectrum patch notes');
    return this.fetchVersions();
  }

  /**
   * Get the LIVE versions announced in the newest patch-note threads.
   *
   * @returns LIVE versions, newest first
   * @throws {@link RSIError} if RSI answers with a non-200 status or an unsuccessful payload
   *
   * @example
   * ```typescript
   * const [current] = await rsi.versions.spectrum.getLive();
   * console.log(current?.name);
   * ```
   */
  public async getLive(): Promise<RSISpectrumVersion[]>
  {
    this.logger.info('Fetching live Spectrum versions');
    return (await this.fetchVersions()).filter(version => version.environment === 'live');
  }

  /**
   * Get the PTU versions announced in the newest patch-note threads, with their wave.
   *
   * @returns PTU versions, newest first
   * @throws {@link RSIError} if RSI answers with a non-200 status or an unsuccessful payload
   *
   * @example
   * ```typescript
   * import { RSISpectrumGroups } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const ptu = await rsi.versions.spectrum.getPtu();
   * const openToAll = ptu.filter(v => v.group === RSISpectrumGroups.ALL);
   * ```
   */
  public async getPtu(): Promise<RSISpectrumVersion[]>
  {
    this.logger.info('Fetching PTU Spectrum versions');
    return (await this.fetchVersions()).filter(version => version.environment === 'ptu');
  }

  /**
   * Get the ETF/Evocati versions announced in the newest patch-note threads.
   *
   * @returns ETF versions, newest first
   * @throws {@link RSIError} if RSI answers with a non-200 status or an unsuccessful payload
   *
   * @example
   * ```typescript
   * const etf = await rsi.versions.spectrum.getEtf();
   * console.log(etf.map(v => v.name));
   * ```
   */
  public async getEtf(): Promise<RSISpectrumVersion[]>
  {
    this.logger.info('Fetching ETF Spectrum versions');
    return (await this.fetchVersions()).filter(version => version.environment === 'etf');
  }

  private async fetchVersions(): Promise<RSISpectrumVersion[]>
  {
    const payload = {
      channel_id: '190048',
      page: 1,
      sort: 'newest',
      label_id: null
    };

    const response = await this.httpClient.post<RSISpectrumThreadResponse>(this.urlSpectrumPatchNotes, payload);
    if (response.status !== 200)
      throw new RSIError(`HTTP request failed while retrieving spectrum threads, status code: ${response.status}`);

    if (response.data.success != 1)
      throw new RSIError(`Query failed from RSI (${response.data.msg})`);

    const threads = response.data.data.threads;

    return threads.map(thread =>
    {
      const name = this.getVersionFromSubject(thread);
      const channel = this.getEnvironment(thread);
      if (channel === RSISpectrumEnvironment.Live || channel === RSISpectrumEnvironment.ETF)
      {
        return { name, environment: channel };
      }

      return {
        name,
        environment: RSISpectrumEnvironment.PTU,
        group: this.getGroup(thread)
      };
    });
  }

  private getVersionFromSubject(thread: RSISpectrumThreadDataThread): string | undefined
  {
    const matches = this.regexVersion.exec(thread.subject);
    if (!matches)
      return undefined;

    const version = matches.at(1)?.trim();
    return version;
  }

  private getEnvironment(thread: RSISpectrumThreadDataThread): RSISpectrumEnvironment | undefined
  {
    // check if the thread is a live version
    if ((/live/i).test(thread.subject))
      return RSISpectrumEnvironment.Live;

    // check if the thread is a ptu version
    if (/(evocati|etf|eptu)/i.test(thread.subject))
      return RSISpectrumEnvironment.ETF;

    // check if the thread is a ptu
    if (/(ptu)/i.test(thread.subject))
      return RSISpectrumEnvironment.PTU;

    return undefined;
  }

  private getGroup(thread: RSISpectrumThreadDataThread): RSISpectrumGroups | undefined
  {
    if (/^\[all waves ptu/i.test(thread.subject))
      return RSISpectrumGroups.ALL;

    const matches = new RegExp(/\[wave\s+(\d+)\s+\w+\]/i).exec(thread.subject);
    if (matches == null)
      return undefined;

    const group = matches.at(1)?.trim();
    if (group == null)
      return undefined;

    const wave = parseInt(group);
    if (wave >= 1 && wave <= 5)
      return wave;

    return undefined;
  }
}