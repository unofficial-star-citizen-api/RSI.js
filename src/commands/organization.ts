import { load } from 'cheerio';
import { BaseCommand } from '@interfaces';
import { Connector } from '@services';

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

interface OrganizationMemberData {
  handle?: string;
  display?: string;
  stars?: number;
  rank?: string;
  roles?: string[];
  image?: string;
}

/**
 * Organization class for retrieving Star Citizen organization information
 */
export class Organization extends BaseCommand<OrganizationData> {
  private readonly urlOrganization = "https://robertsspaceindustries.com/orgs/{0}";
  private readonly urlSearchOrgs = "https://robertsspaceindustries.com/api/orgs/getOrgs";
  private readonly sid: string;
  private connector: Connector;

  /**
   * @param sid - The Spectrum Identification (sid)
   */
  constructor(sid: string) {
    super();
    this.sid = sid;
    this.connector = new Connector();
  }

  /**
   * Execute the command to retrieve organization information
   */
  public async execute(): Promise<OrganizationData | null> {
    // Using Promise.all instead of threads
    const [orgInfo, searchResult] = await Promise.all([
      this.getOrganizationInfo(this.sid),
      this.searchOrgs(this.sid)
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
    const req = await this.connector.request<string>(url, null, {}, 'get');

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
      result.logo = Connector.convertPath(logo);
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
      result.focus.primary!.image = Connector.convertPath(primaryImg);
    }

    const primaryAlt = $('.primary.tooltip-wrap img').attr('alt');
    if (primaryAlt) {
      result.focus.primary!.name = primaryAlt.trim();
    }

    // Secondary focus
    const secondaryImg = $('.secondary.tooltip-wrap img').attr('src');
    if (secondaryImg) {
      result.focus.secondary!.image = Connector.convertPath(secondaryImg);
    }

    const secondaryAlt = $('.secondary.tooltip-wrap img').attr('alt');
    if (secondaryAlt) {
      result.focus.secondary!.name = secondaryAlt.trim();
    }

    // Get banner image
    const banner = $('.banner img').attr('src');
    if (banner) {
      result.banner = Connector.convertPath(banner);
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

    const req = await this.connector.request<{
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
        org.href = Connector.convertPath(href);
      }

      // Get logo
      const logo = $(element).find('.left .thumb img').attr('src');
      if (logo) {
        org.logo = Connector.convertPath(logo);
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

/**
 * OrganizationMembers class for retrieving organization member information
 */
export class OrganizationMembers extends BaseCommand<OrganizationMemberData[]> {
  private readonly urlOrganizationMembers = "https://robertsspaceindustries.com/api/orgs/getOrgMembers";
  private readonly sid: string;
  private readonly kwargs: Record<string, unknown>;
  private connector: Connector;

  /**
   * @param sid - The Spectrum Identification (sid)
   * @param kwargs - Additional filtering options
   */
  constructor(sid: string, kwargs: Record<string, unknown> = {}) {
    super();
    this.sid = sid;
    this.kwargs = kwargs;
    this.connector = new Connector();
  }

  /**
   * Execute the command to retrieve organization member information
   */
  public async execute(): Promise<OrganizationMemberData[]> {
    const result: OrganizationMemberData[] = [];
    const page = this.convertVal(this.kwargs.page);

    const jsonData: Record<string, unknown> = {
      symbol: this.sid,
      search: "",
      pagesize: 32,
      page: page
    };

    if ('rank' in this.kwargs) {
      jsonData.rank = this.convertVal(this.kwargs.rank);
    } else if ('role' in this.kwargs) {
      jsonData.role = this.convertVal(this.kwargs.role);
    } else if ('main_org' in this.kwargs) {
      const mainOrg = this.convertVal(this.kwargs.main_org);
      jsonData.main_org = mainOrg.toLowerCase() === 'true' ? 1 : 0;
    }

    // Request website
    const req = await this.connector.request<{
      success: number;
      code?: string;
      msg?: string;
      data?: {
        html: string;
      }
    }>(this.urlOrganizationMembers, jsonData);

    if (req === null) {
      return result;
    } else if (req.status !== 200) {
      return result;
    }

    const res = req.data;

    if (res.success === 0) {
      if (res.code === 'ErrApiThrottled') {
        console.log("Failed, retrying");
      } else {
        console.log(`Failed (${res.msg})`);
      }
      return result;
    }

    if (!res.data?.html || res.data.html === '') {
      return result;
    }

    // Get HTML contents
    const $ = load(res.data.html);
    const handles = new Set<string>(); // To track unique handles

    $('.member-item').each((_, element) => {
      const user: OrganizationMemberData = {};

      // Get handle
      user.handle = $(element).find('.nick').text().trim();

      // Check if the handle is already in result
      if (user.handle && handles.has(user.handle)) {
        return;
      }

      if (user.handle) {
        handles.add(user.handle);
      }

      // Get display name
      user.display = $(element).find('.name').text().trim();

      // Get star rating
      const starsStyle = $(element).find('.stars[style]').attr('style');
      if (starsStyle) {
        const match = /:\s*([0-9]*)%/.exec(starsStyle);
        if (match) {
          user.stars = Math.floor(parseInt(match[1]) / 20);
        }
      }

      // Get rank
      const rankElement = $(element).find('.rank').filter((_, el) => $(el).attr('class') === 'rank');
      user.rank = rankElement.text().trim();

      // Get roles
      user.roles = [];
      $(element).find('.rolelist li').each((_, role) => {
        const roleText = $(role).text();
        if (roleText) {
          user.roles!.push(roleText);
        }
      });

      // Get image
      const imgSrc = $(element).find('img').attr('src');
      if (imgSrc) {
        user.image = Connector.convertPath(imgSrc.trim());
      }

      // Skip entries that are empty or just contain "&nbsp;"
      if (user.handle && user.handle.trim() !== "") {
        result.push(user);
      }
    });

    return result;
  }
}
