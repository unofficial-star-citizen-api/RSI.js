import { RSIError } from '@/errors';
import { HttpClient } from '@/http-client';
import { createLogger } from '@/logger';
import { load } from 'cheerio';
import { RSIPatchNote } from './interfaces/patch-note.interface';

/**
 * Patch notes from the RSI patch notes page, newest first. Access it through `rsi.versions.patchNote`.
 * Exported as `VersionsPatchNotes`.
 *
 * Every method reads the first page of patch notes.
 *
 * @category Versions
 * @see https://robertsspaceindustries.com/patch-notes
 */
export class PatchNote
{
  private readonly url = 'https://robertsspaceindustries.com/patch-notes';
  private readonly httpClient: HttpClient;
  private readonly logger = createLogger(PatchNote.name);

  /** @hidden */
  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  /**
   * Get the patch notes listed on the patch notes page, newest first.
   *
   * @returns The patch notes
   * @throws {@link RSIError} if RSI answers with a non-200 status
   *
   * @example
   * ```typescript
   * import { RSI } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   * const patchNotes = await rsi.versions.patchNote.getAll();
   *
   * console.log(patchNotes.map(note => `${note.version}: ${note.meta.url}`));
   * ```
   */
  public async getAll(): Promise<RSIPatchNote[]>
  {
    this.logger.info('Fetching patch notes');
    return this.fetchAll();
  }

  /**
   * Get the most recent patch note.
   *
   * @returns The latest patch note, or `undefined` if the page lists none
   * @throws {@link RSIError} if RSI answers with a non-200 status
   *
   * @example
   * ```typescript
   * const latest = await rsi.versions.patchNote.getLatest();
   * console.log(latest?.title, latest?.time_ago);
   * ```
   */
  public async getLatest(): Promise<RSIPatchNote | undefined>
  {
    this.logger.info('Fetching the latest patch note');
    return (await this.fetchAll()).at(0);
  }

  /**
   * Find the newest patch note whose version contains the given text.
   *
   * @param version - Version to look for, for example `4.0.1`; a prefix such as `4.0` also matches
   * @returns The matching patch note, or `undefined` if none is listed on the first page
   * @throws {@link RSIError} if RSI answers with a non-200 status
   *
   * @example
   * ```typescript
   * const note = await rsi.versions.patchNote.find('4.0.1');
   * console.log(note?.meta.url);
   * ```
   */
  public async find(version: string): Promise<RSIPatchNote | undefined>
  {
    this.logger.info('Searching patch notes by version', { version });
    return (await this.fetchAll()).find(patchNote => patchNote.version?.includes(version));
  }

  private async fetchAll(): Promise<RSIPatchNote[]>
  {
    const response = await this.httpClient.get<string>(this.url);
    if (response.status !== 200)
      throw new RSIError(`HTTP request failed while retrieving patch notes, status code: ${response.status}`);

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