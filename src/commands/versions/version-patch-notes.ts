import { HttpClient } from '@/http-client';
import { createLogger } from '@/logger';
import { load } from 'cheerio';
import { RSIPatchNote } from './interfaces/patch-note.interface';

export class PatchNote
{
  private readonly url = 'https://robertsspaceindustries.com/patch-notes';
  private readonly httpClient: HttpClient;
  private readonly logger = createLogger(PatchNote.name);

  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  public async getAll(): Promise<RSIPatchNote[]>
  {
    this.logger.info('Fetching patch notes');
    return this.fetchAll();
  }

  public async getLatest(): Promise<RSIPatchNote | undefined>
  {
    this.logger.info('Fetching the latest patch note');
    return (await this.fetchAll()).at(0);
  }

  public async find(version: string): Promise<RSIPatchNote | undefined>
  {
    this.logger.info('Searching patch notes by version', { version });
    return (await this.fetchAll()).find(patchNote => patchNote.version?.includes(version));
  }

  private async fetchAll(): Promise<RSIPatchNote[]>
  {
    const response = await this.httpClient.get<string>(this.url);

    const $ = load(response.data);

    return $('#channel a.content-block2').toArray().map((element) =>
    {
      const link = $(element).attr('href')?.trim();

      return {
        title: $(element).find('.title').text().trim(),
        version: $(element).text().match(/((\d\.?)+)/)?.at(1)?.trim(),
        meta: {
          url: HttpClient.toAbsoluteUrl(link)
        },
        image: $(element).find('.background').attr('style')?.match(/url\(["'](.*?)["']/)?.at(1)?.trim(),
        commentCount: Number($(element).find('.text.comments').text() ?? 0),
        time_ago: $(element).find('.text .time_ago .value').text()?.trim(),
      };
    });
  }
}