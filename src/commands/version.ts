import { load } from 'cheerio';
import { BaseCommand } from '@interfaces';
import { Connector } from '@services';

interface VersionData {
  link?: string;
  title?: string;
  version?: string;
  image?: string;
}

/**
 * Version class for retrieving Star Citizen version info
 */
export class Version extends BaseCommand<VersionData[]> {
  private readonly urlPatchNotes = "https://robertsspaceindustries.com/patch-notes";
  private readonly regexWebsiteVersion = /(\d\.?)+/;
  private readonly regexWebsiteBackground = /(background-image\s*:\s*url\(')(.*)('\))/;
  private connector: Connector;

  constructor() {
    super();
    this.connector = new Connector();
  }

  /**
   * Execute the command to retrieve version information
   */
  public async execute(): Promise<VersionData[] | null> {
    const result: VersionData[] = [];

    const req = await this.connector.request<string>(this.urlPatchNotes, null, {}, 'get');

    if (req === null || req.status !== 200) {
      return null;
    }

    const $ = load(req.data);
    $('.content-block2.hub-block').each((_, element) => {
      const patch: VersionData = {};

      // Get article URL
      const href = $(element).attr('href');
      if (href) {
        patch.link = Connector.convertPath(href);
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
          patch.image = Connector.convertPath(background);
        }
      }

      result.push(patch);
    });

    return result;
  }
}
