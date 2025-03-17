import { load } from 'cheerio';
import { HttpClient } from '../../http-client';

/**
 * Organization class for retrieving Star Citizen organization information
 */
export class OrganizationSearch
{
  private readonly urlOrganization = 'https://robertsspaceindustries.com/orgs/{0}';
  // private readonly urlSearchOrgs = 'https://robertsspaceindustries.com/api/orgs/getOrgs';
  private readonly httpClient: HttpClient;

  /**
   * @param sid - The Spectrum Identification (sid)
   */
  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  /**
   * Execute the command to retrieve organization information
   */
  // public async findInfo(sid: string): Promise<OrganizationDetail | null>
  // {
  //   // Using Promise.all instead of threads
  //   const [orgInfo, searchResult] = await Promise.all([
  //     this.get(sid),
  //     this.search(sid)
  //   ]);

  //   if (orgInfo === null && searchResult === null)
  //     return null;

  //   // If no organization info is found
  //   if (orgInfo === null)
  //   {
  //     if (Array.isArray(searchResult) && searchResult.length > 0)
  //     {
  //       return searchResult[0];
  //     }
  //     return null;
  //   }

  //   // If no search result is found
  //   if (searchResult === null)
  //   {
  //     if (orgInfo && Object.keys(orgInfo).length > 0)
  //     {
  //       return orgInfo;
  //     }
  //     return null;
  //   }

  //   // Merge data
  //   let result: OrganizationDetail = { ...orgInfo };

  //   if (Array.isArray(searchResult) && searchResult.length > 0)
  //   {
  //     result = { ...result, ...searchResult[0] };
  //   }

  //   return result;
  // }

  /**
   * Get organization info
   * @param sid - The Spectrum Identification (sid)
   * @returns Organization information
   */
  public async get(sid: string): Promise<OrganizationDetail | null>
  {
    const url = this.urlOrganization.replace('{0}', sid);

    // Request website
    const response = await this.httpClient.get<string>(url);
    if (response.status !== 200)
      return null;

    // Get HTML contents
    const $ = load(response.data);

    return {
      url,
      sid,
      name: $('#organization h1').text().trim().replace(/^\//g, '').replace(/\/$/g, ''),
      logo: $('.logo.noshadow img').attr('src'),
      banner: $('.banner img').attr('src'),
      focus: {
        primary: {
          image: HttpClient.toAbsoluteUrl($('.primary.tooltip-wrap img').attr('src')),
          name: $('.primary.tooltip-wrap img').attr('alt')
        },
        secondary: {
          image: HttpClient.toAbsoluteUrl($('.secondary.tooltip-wrap img').attr('src')),
          name: $('.secondary.tooltip-wrap img').attr('alt')
        }
      },

      headline: {
        html: $('.body.markitup-text').html() ?? undefined,
        plaintext: $('.body.markitup-text').text()
      },
      history: {
        html: $('#tab-history div').html() ?? undefined,
        plaintext: $('#tab-history div').text()
      },
      manifesto: {
        html: $('#tab-manifesto div').html() ?? undefined,
        plaintext: $('#tab-manifesto div').text()
      },
      charter: {
        html: $('#tab-charter div').html() ?? undefined,
        plaintext: $('#tab-charter div').text()
      }
    };
  }

  /**
   * Search organizations by SID
   * @param sid - Spectrum Identification of the organization
   * @returns Organizations found
   */
  // private async search(sid: string): Promise<OrganizationDetail[] | null>
  // {
  //   const results: OrganizationDetail[] = [];
  //   const page = 1;

  //   const payload = {
  //     activity: [],
  //     commitment: [],
  //     language: [],
  //     model: [],
  //     pagesize: 12,
  //     recruiting: [],
  //     roleplay: [],
  //     search: sid,
  //     page: page,
  //     size: [],
  //     sort: ''
  //   };

  //   const req = await this.httpClient.post<{
  //     success: number;
  //     code?: string;
  //     msg?: string;
  //     data?: {
  //       html: string;
  //     };
  //   }>(this.urlSearchOrgs, payload);

  //   if (req === null)
  //   {
  //     return null;
  //   } else if (req.status === 404)
  //   {
  //     return [];
  //   } else if (req.status !== 200)
  //   {
  //     return null;
  //   }

  //   // Get html contents
  //   const result = req.data;

  //   if (result.success === 0)
  //   {
  //     console.log(`${result.code}: ${result.msg}`);
  //     return null;
  //   }

  //   const rowHtml = result.data?.html;
  //   if (!rowHtml || rowHtml.trim() === '')
  //   {
  //     return null;
  //   }

  //   // Start process html
  //   const $ = load(rowHtml);

  //   $('.org-cell').each((_, element) =>
  //   {
  //     const org: OrganizationDetail = {};

  //     // Get SID
  //     org.sid = $(element).find('.left .identity .symbol').text().trim();

  //     // Ensure the right Organization is returned
  //     if (org.sid !== sid)
  //     {
  //       return;
  //     }

  //     // Get href
  //     const href = $(element).find('a').attr('href');
  //     if (href)
  //     {
  //       org.href = HttpClient.toAbsoluteUrl(href);
  //     }

  //     // Get logo
  //     const logo = $(element).find('.left .thumb img').attr('src');
  //     if (logo)
  //     {
  //       org.logo = HttpClient.toAbsoluteUrl(logo);
  //     }

  //     // Get name
  //     org.name = $(element).find('.left .identity .name').text();

  //     // Get archetype
  //     org.archetype = $(element).find('.right .infocontainer:first-child .infoitem:nth-child(1) .value').text();

  //     // Get language
  //     org.lang = $(element).find('.right .infocontainer:first-child .infoitem:nth-child(2) .value').text();

  //     // Get commitment
  //     org.commitment = $(element).find('.right .infocontainer:first-child .infoitem:nth-child(3) .value').text();

  //     // Get recruiting status
  //     const recruiting = $(element).find('.right .infocontainer:nth-child(2) .infoitem:nth-child(1) .value').text();
  //     org.recruiting = (recruiting === 'Yes');

  //     // Get roleplay status
  //     const roleplay = $(element).find('.right .infocontainer:nth-child(2) .infoitem:nth-child(2) .value').text();
  //     org.roleplay = (roleplay === 'Yes');

  //     // Get member count
  //     const members = $(element).find('.right .infocontainer:nth-child(2) .infoitem:nth-child(3) .value').text();
  //     org.members = parseInt(members);

  //     results.push(org);
  //   });

  //   return results;
  // }
}
