import { load } from 'cheerio';
import { HttpClient } from '../../http-client';

interface PatchNoteData {
  link?: string;
  title?: string;
  version?: string;
  image?: string;
}

/**
 * Version class for retrieving Star Citizen version info
 */
export class Version {
  private readonly urlPatchNotes = 'https://robertsspaceindustries.com/patch-notes';
  private readonly urlRoadmap = 'https://robertsspaceindustries.com/api/roadmap/v1/init';

  private readonly regexWebsiteVersion = /(\d\.?)+/;
  private readonly regexWebsiteBackground = /(background-image\s*:\s*url\(')(.*)('\))/;
  private readonly regexApiLive = /(live\s*version\s*:\s*(?<live_api>(\d+(\.\d+)*))?)/i; //TODO replace with Star Citizen Notifier Regex
  private readonly regexApiPtu = /(ptu\s*version\s*:\s*(?<ptu_version>(\d+(\.\d+)*))?)/i; //TODO replace with Star Citizen Notifier Regex
  private readonly regexApiEtf = /(ptu\s*version\s*:\s*(?<etf_version>(\d+(\.\d+)*)(.*?)((ETF)|(Evocati))))/i; //TODO replace with Star Citizen Notifier Regex

  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Retrieve patch notes from the RSI website
   * @see https://robertsspaceindustries.com/patch-notes
   */
  public async getPatchNotes(): Promise<PatchNoteData[] | null> {
    const result: PatchNoteData[] = [];

    const req = await this.httpClient.get<string>(this.urlPatchNotes);

    if (req === null || req.status !== 200) {
      return null;
    }

    const $ = load(req.data);
    $('.content-block2.hub-block').each((_, element) => {
      const patch: PatchNoteData = {};

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

  /**
   * Retrieve the current live, ptu and etf versions from the Roadmap API
   * @see https://robertsspaceindustries.com/roadmap
   */
  public async getVersions(): Promise<{ current_live: string | null, current_ptu: string | null, current_etf: string | null }> {
    const req = await this.httpClient.get<string>(this.urlRoadmap);
    if (req === null || req.status !== 200) {
      throw new Error(`HTTP request failed while retrieving stats data, status code: ${req.status}`);
    }

    const text = req.data;
    const livePu = this.getLivePu(text);
    const livePtu = this.getLivePtu(text);
    const liveEtf = this.getLiveEtf(text);

    return {
      current_live: livePu,
      current_ptu: livePtu,
      current_etf: liveEtf,
    };
  }

  private getLivePu(text: string): string | null {
    const match = this.regexApiLive.exec(text);
    if (match && match.groups) {
      return match.groups.live_api;
    }
    return null;
  }

  private getLivePtu(text: string): string | null {
    const match = this.regexApiPtu.exec(text);
    if (match && match.groups) {
      return match.groups.ptu_version;
    }
    return null;
  }

  private getLiveEtf(text: string): string | null {
    const match = this.regexApiEtf.exec(text);
    if (match && match.groups) {
      return match.groups.etf_version;
    }
    return null;
  }
}
