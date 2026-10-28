// External modules
import { HttpClient } from '@/http-client';
import { RSIError } from '@/errors';
import { createLogger } from '@/logger';
import
{
  RSISpectrumEnvironment, RSISpectrumGroups, RSISpectrumVersion
} from './interfaces';
import { RSISpectrumThreadDataThread, RSISpectrumThreadResponse } from './interfaces/spectrum-thread.interface';

export class Spectrum
{
  private readonly urlSpectrumPatchNotes = 'https://robertsspaceindustries.com/api/spectrum/forum/channel/threads';

  private readonly regexVersion = /(\d(\.\d+)+)\s?(\d+)?\s?(\w+)/;
  private readonly httpClient: HttpClient;
  private readonly logger = createLogger(Spectrum.name);

  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  public async get(): Promise<RSISpectrumVersion[]>
  {
    this.logger.info('Fetching Spectrum patch notes');
    return this.fetchVersions();
  }

  public async getLive(): Promise<RSISpectrumVersion[]>
  {
    this.logger.info('Fetching live Spectrum versions');
    return (await this.fetchVersions()).filter(version => version.environment === 'live');
  }

  public async getPtu(): Promise<RSISpectrumVersion[]>
  {
    this.logger.info('Fetching PTU Spectrum versions');
    return (await this.fetchVersions()).filter(version => version.environment === 'ptu');
  }

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