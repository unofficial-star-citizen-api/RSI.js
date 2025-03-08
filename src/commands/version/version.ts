import { load } from 'cheerio';
import { HttpClient } from '../../http-client';

interface VersionData {
  link?: string;
  title?: string;
  version?: string;
  image?: string;
}

/**
 * Version class for retrieving Star Citizen version info
 */
export class Version {
  private readonly urlPatchNotes = "https://robertsspaceindustries.com/patch-notes";
  private readonly regexWebsiteVersion = /(\d\.?)+/;
  private readonly regexWebsiteBackground = /(background-image\s*:\s*url\(')(.*)('\))/;
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Execute the command to retrieve version information
   */
  public async search(): Promise<VersionData[] | null> {
    const result: VersionData[] = [];

    const req = await this.httpClient.get<string>(this.urlPatchNotes);

    if (req === null || req.status !== 200) {
      return null;
    }

    const $ = load(req.data);
    $('.content-block2.hub-block').each((_, element) => {
      const patch: VersionData = {};

      // Get article URL
      const href = $(element).attr('href');
      if (href) {
        patch.link = HttpClient.convertPath(href);
      }

      // Get article title
      const title = $(element).find('.title-holder').text().trim();
      if (title) {
        patch.title = title;
        const match = this.regexWebsiteVersion.exec(title);
        if (match) {
          patch.version = match[0];
        }
      }

      // Get background image
      const backgroundStyle = $(element).find('.background').attr('style');
      if (backgroundStyle) {
        const match = this.regexWebsiteBackground.exec(backgroundStyle);
        if (match) {
          const background = match[2];
          patch.image = HttpClient.convertPath(background);
        }
      }

      result.push(patch);
    });

    return result;
  }
}
