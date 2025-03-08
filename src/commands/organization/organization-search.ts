import { load } from 'cheerio';
import { HttpClient } from '../../http-client';

interface OrganizationData {
  url?: string;
  sid?: string;
  logo?: string;
  name?: string;
  focus?: {
    primary?: {
      image?: string;
      name?: string;
    };
    secondary?: {
      image?: string;
      name?: string;
    };
  };
  banner?: string;
  headline?: {
    html?: string;
    plaintext?: string;
  };
  history?: {
    html?: string;
    plaintext?: string;
  };
  manifesto?: {
    html?: string;
    plaintext?: string;
  };
  charter?: {
    html?: string;
    plaintext?: string;
  };
  archetype?: string;
  lang?: string;
  commitment?: string;
  recruiting?: boolean;
  roleplay?: boolean;
  members?: number;
  href?: string;
  [key: string]: unknown;
}

/**
 * Organization class for retrieving Star Citizen organization information
 */
export class OrganizationSearch {
  private readonly urlOrganization = "https://robertsspaceindustries.com/orgs/{0}";
  private readonly urlSearchOrgs = "https://robertsspaceindustries.com/api/orgs/getOrgs";
  private readonly httpClient: HttpClient;

  /**
   * @param sid - The Spectrum Identification (sid)
   */
  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Execute the command to retrieve organization information
   */
  public async findOrganization(sid: string): Promise<OrganizationData | null> {
    // Using Promise.all instead of threads
    const [orgInfo, searchResult] = await Promise.all([
      this.getOrganizationInfo(sid),
      this.searchOrgs(sid)
    ]);

    if (orgInfo === null && searchResult === null) {
      return null;
    }

    // If no organization info is found
    if (orgInfo === null) {
      if (Array.isArray(searchResult) && searchResult.length > 0) {
        return searchResult[0];
      }
      return null;
    }

    // If no search result is found
    if (searchResult === null) {
      if (orgInfo && Object.keys(orgInfo).length > 0) {
        return orgInfo;
      }
      return null;
    }

    // Merge data
    let result: OrganizationData = { ...orgInfo };

    if (Array.isArray(searchResult) && searchResult.length > 0) {
      result = { ...result, ...searchResult[0] };
    }

    return result;
  }

  /**
   * Get organization info
   * @param sid - The Spectrum Identification (sid)
   * @returns Organization information
   */
  private async getOrganizationInfo(sid: string): Promise<OrganizationData | null> {
    const result: OrganizationData = {};
    const url = this.urlOrganization.replace('{0}', sid);

    // Request website
    const req = await this.httpClient.get<string>(url);

    if (req === null) {
      return null;
    } else if (req.status === 404) {
      return {};
    } else if (req.status !== 200) {
      return null;
    }

    // Get HTML contents
    const $ = load(req.data);

    result.url = url;
    result.sid = sid;

    // Get logo
    const logo = $('.logo.noshadow img').attr('src');
    if (logo) {
      result.logo = HttpClient.convertPath(logo);
    }

    // Get organization name
    result.name = $('#organization h1').text().trim().replace(/^\//g, '').replace(/\/$/g, '');

    // Get focus info
    result.focus = {
      primary: {},
      secondary: {}
    };

    // Primary focus
    const primaryImg = $('.primary.tooltip-wrap img').attr('src');
    if (primaryImg) {
      result.focus.primary!.image = HttpClient.convertPath(primaryImg);
    }

    const primaryAlt = $('.primary.tooltip-wrap img').attr('alt');
    if (primaryAlt) {
      result.focus.primary!.name = primaryAlt.trim();
    }

    // Secondary focus
    const secondaryImg = $('.secondary.tooltip-wrap img').attr('src');
    if (secondaryImg) {
      result.focus.secondary!.image = HttpClient.convertPath(secondaryImg);
    }

    const secondaryAlt = $('.secondary.tooltip-wrap img').attr('alt');
    if (secondaryAlt) {
      result.focus.secondary!.name = secondaryAlt.trim();
    }

    // Get banner image
    const banner = $('.banner img').attr('src');
    if (banner) {
      result.banner = HttpClient.convertPath(banner);
    }

    // Get headline
    result.headline = {};
    const headlineHtml = $('.body.markitup-text').html();
    if (headlineHtml) {
      result.headline.html = headlineHtml;
      result.headline.plaintext = $('.body.markitup-text').text();
    }

    // Get history
    result.history = {};
    const historyHtml = $('#tab-history div').html();
    if (historyHtml) {
      result.history.html = historyHtml;
      result.history.plaintext = $('#tab-history div').text();
    }

    // Get manifesto
    result.manifesto = {};
    const manifestoHtml = $('#tab-manifesto div').html();
    if (manifestoHtml) {
      result.manifesto.html = manifestoHtml;
      result.manifesto.plaintext = $('#tab-manifesto div').text();
    }

    // Get charter
    result.charter = {};
    const charterHtml = $('#tab-charter div').html();
    if (charterHtml) {
      result.charter.html = charterHtml;
      result.charter.plaintext = $('#tab-charter div').text();
    }

    return result;
  }

  /**
   * Search organizations by SID
   * @param sid - Spectrum Identification of the organization
   * @returns Organizations found
   */
  private async searchOrgs(sid: string): Promise<OrganizationData[] | null> {
    const results: OrganizationData[] = [];
    const page = 1;

    const payload = {
      activity: [],
      commitment: [],
      language: [],
      model: [],
      pagesize: 12,
      recruiting: [],
      roleplay: [],
      search: sid,
      page: page,
      size: [],
      sort: ""
    };

    const req = await this.httpClient.post<{
      success: number;
      code?: string;
      msg?: string;
      data?: {
        html: string;
      }
    }>(this.urlSearchOrgs, payload);

    if (req === null) {
      return null;
    } else if (req.status === 404) {
      return [];
    } else if (req.status !== 200) {
      return null;
    }

    // Get html contents
    const result = req.data;

    if (result.success === 0) {
      console.log(`${result.code}: ${result.msg}`);
      return null;
    }

    const rowHtml = result.data?.html;
    if (!rowHtml || rowHtml.trim() === "") {
      return null;
    }

    // Start process html
    const $ = load(rowHtml);

    $('.org-cell').each((_, element) => {
      const org: OrganizationData = {};

      // Get SID
      org.sid = $(element).find('.left .identity .symbol').text().trim();

      // Ensure the right Organization is returned
      if (org.sid !== sid) {
        return;
      }

      // Get href
      const href = $(element).find('a').attr('href');
      if (href) {
        org.href = HttpClient.convertPath(href);
      }

      // Get logo
      const logo = $(element).find('.left .thumb img').attr('src');
      if (logo) {
        org.logo = HttpClient.convertPath(logo);
      }

      // Get name
      org.name = $(element).find('.left .identity .name').text();

      // Get archetype
      org.archetype = $(element).find('.right .infocontainer:first-child .infoitem:nth-child(1) .value').text();

      // Get language
      org.lang = $(element).find('.right .infocontainer:first-child .infoitem:nth-child(2) .value').text();

      // Get commitment
      org.commitment = $(element).find('.right .infocontainer:first-child .infoitem:nth-child(3) .value').text();

      // Get recruiting status
      const recruiting = $(element).find('.right .infocontainer:nth-child(2) .infoitem:nth-child(1) .value').text();
      org.recruiting = (recruiting === "Yes");

      // Get roleplay status
      const roleplay = $(element).find('.right .infocontainer:nth-child(2) .infoitem:nth-child(2) .value').text();
      org.roleplay = (roleplay === "Yes");

      // Get member count
      const members = $(element).find('.right .infocontainer:nth-child(2) .infoitem:nth-child(3) .value').text();
      org.members = parseInt(members);

      results.push(org);
    });

    return results;
  }
}
