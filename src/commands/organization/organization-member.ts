import { load } from 'cheerio';
import { HttpClient } from '../../http-client';
import { HttpHelper } from 'src/helpers/http.helper'

interface OrganizationMemberData {
  handle?: string;
  display?: string;
  stars?: number;
  rank?: string;
  roles?: string[];
  image?: string;
}

/**
 * OrganizationMembers class for retrieving organization member information
 */
export class OrganizationMembers {
  private readonly urlOrganizationMembers = "https://robertsspaceindustries.com/api/orgs/getOrgMembers";
  private readonly httpClient: HttpClient;

  /**
   * @param sid - The Spectrum Identification (sid)
   * @param kwargs - Additional filtering options
   */
  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Execute the command to retrieve organization member information
   */
  public async getOrganizationMembers(sid: string, kwargs: Record<string, unknown> = {}): Promise<OrganizationMemberData[]> {
    const result: OrganizationMemberData[] = [];
    const page = HttpHelper.convertVal(kwargs.page);

    const jsonData: Record<string, unknown> = {
      symbol: sid,
      search: "",
      pagesize: 32,
      page: page
    };

    if ('rank' in kwargs) {
      jsonData.rank = HttpHelper.convertVal(kwargs.rank);
    } else if ('role' in kwargs) {
      jsonData.role = HttpHelper.convertVal(kwargs.role);
    } else if ('main_org' in kwargs) {
      const mainOrg = HttpHelper.convertVal(kwargs.main_org);
      jsonData.main_org = mainOrg.toLowerCase() === 'true' ? 1 : 0;
    }

    // Request website
    const req = await this.httpClient.post<{
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
        user.image = HttpClient.convertPath(imgSrc.trim());
      }

      // Skip entries that are empty or just contain "&nbsp;"
      if (user.handle && user.handle.trim() !== "") {
        result.push(user);
      }
    });

    return result;
  }
}
