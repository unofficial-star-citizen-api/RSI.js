import { load } from 'cheerio';
import { HttpClient } from '../../http-client';
import { PatchNoteModel } from './types/patch-note.type';

export class PatchNote
{
  private readonly url = 'https://robertsspaceindustries.com/patch-notes';
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  public async getAll(): Promise<PatchNoteModel[]>
  {
    const response = await this.httpClient.get<string>(this.url);

    const $ = load(response.data);

    return $('#channel a.content-block2').toArray().map((element) => ({
      title: $(element).find('.title').text().trim(),
      version: $(element).text().match(/((\d\.?)+)/)?.at(1)?.trim(),
      link: $(element).attr('href')?.trim(),
      image: $(element).find('.background').attr('style')?.match(/url\(["'](.*?)["']/)?.at(1)?.trim(),
      comments: Number($(element).find('.text.comments').text() ?? 0),
      time_ago: $(element).find('.text .time_ago .value').text()?.trim(),
    }));
  }

  public async getLatest(): Promise<PatchNoteModel | undefined>
  {
    return this.getAll()
      .then(patchNotes => patchNotes.at(0));
  }

  public async find(version: string): Promise<PatchNoteModel | undefined>
  {
    return this.getAll().then(patchNotes => patchNotes.find(patchNote => patchNote.version?.includes(version)));
  }
}