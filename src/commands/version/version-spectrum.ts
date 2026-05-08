// External modules
import { HttpClient } from '@/http-client';
import { SpectrumThreads, Thread } from './types/spectrum-thread.type';

export type SpectrumVersion = SpectrumVersionPtu | {
  name: string | undefined;
  environment: 'live' | 'etf' | undefined;
};

export type SpectrumVersionPtu = {
  name: string | undefined;
  environment: 'ptu';
  group: Groups | undefined;
};

/**
 * PTU Waves
 * @enum {number} Waves
 * @see https://support.robertsspaceindustries.com/hc/en-us/articles/115013195927-Public-Test-Universe-PTU-FAQ#h_01H9N5R5CT0W3RAF9VMRJSPKT5
 */
export enum Groups
{
  GROUP_1 = 1,
  GROUP_2 = 2,
  GROUP_3 = 3,
  GROUP_4 = 4,
  ALL = 5,
}

export class Spectrum
{
  private readonly urlSpectrumPatchNotes = 'https://robertsspaceindustries.com/api/spectrum/forum/channel/threads';

  private readonly regexVersion = /(\d(\.\d+)+)\s?(\d+)?\s?(\w+)/;
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  public async get(): Promise<SpectrumVersion[]>
  {
    const payload = {
      channel_id: '190048',
      page: 1,
      sort: 'newest',
      label_id: null
    };

    const response = await this.httpClient.post<SpectrumThreads>(this.urlSpectrumPatchNotes, payload);
    if (response.data.success != 1)
      throw new Error(`Query failed from RSI (${response.data.msg})`);

    const threads = response.data.data.threads;

    return threads.map(thread =>
    {
      const name = this.getVersionFromSubject(thread);
      const channel = this.getEnvironment(thread);
      if (channel === 'live' || channel === 'etf')
      {
        return { name, environment: channel };
      }

      return {
        name,
        environment: 'ptu',
        group: this.getGroup(thread)
      };
    });
  }

  public async getLive(): Promise<SpectrumVersion[]>
  {
    return this.get().then(versions => versions.filter(version => version.environment === 'live'));
  }

  public async getPtu(): Promise<SpectrumVersion[]>
  {
    return this.get().then(versions => versions.filter(version => version.environment === 'ptu'));
  }

  public async getEtf(): Promise<SpectrumVersion[]>
  {
    return this.get().then(versions => versions.filter(version => version.environment === 'etf'));
  }

  private getVersionFromSubject(thread: Thread): string | undefined
  {
    const matches = this.regexVersion.exec(thread.subject);
    if (!matches)
      return undefined;

    const version = matches.at(1)?.trim();
    return version;
  }

  private getEnvironment(thread: Thread): 'live' | 'ptu' | 'etf' | undefined
  {
    // check if the thread is a live version
    if ((/live/i).test(thread.subject))
      return 'live';

    // check if the thread is a ptu version
    if (/(evocati|etf|eptu)/i.test(thread.subject))
      return 'etf';

    // check if the thread is a ptu
    if (/(ptu)/i.test(thread.subject))
      return 'ptu';

    return undefined;
  }

  private getGroup(thread: Thread): Groups | undefined
  {
    if (/^\[all waves ptu/i.test(thread.subject))
      return Groups.ALL;

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