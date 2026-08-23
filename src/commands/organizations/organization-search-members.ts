import { HttpClient } from '@/http-client';
import { load } from 'cheerio';
import { RSIOrganizationMember } from './interfaces/organization-members.interface';
import { RSIResponse } from './interfaces/rsi-response.interface';

export type OrganizationMembersSearchParams = {
  /**
   * Organization SID
   */
  sid: string;

  /**
   * Search query
   */
  search?: string;

  /**
   * Member rank index starting at 1
   */
  rankIndex?: string;

  /**
   * Member role index starting at 1
   */
  roleIndex?: number;

  /**
   * Is main organization
   */
  isMainOrg?: boolean;

  /**
   * Page number
   */
  page?: number;

  /**
   * Page size
   */
  pageSize?: number;
};


type ReturnFunction = (params: OrganizationMembersSearchParams) => Promise<RSIOrganizationMember[]>;

export function searchMembers(httpClient: HttpClient): ReturnFunction
{
  const urlOrganizationMembers = 'https://robertsspaceindustries.com/api/orgs/getOrgMembers';

  return async function (params: OrganizationMembersSearchParams): Promise<RSIOrganizationMember[]>
  {
    const payload = {
      sid: params.sid,
      search: params.search,
      rank: params.rankIndex,
      role: params.roleIndex,
      isMainOrg: params.isMainOrg,
      page: params.page,
      pageSize: params.pageSize,
    };

    const response = await httpClient.post<RSIResponse>(urlOrganizationMembers, payload);
    if (response.status !== 200)
    {
      throw new Error(`HTTP request failed while retrieving organization members data, status code: ${response.status}`);
    }

    if (response.data.success !== 1)
    {
      throw new Error(`Failed to retrieve organization members: ${response.data.msg}`);
    }

    // Get HTML contents
    const $ = load(response.data.data.html);
    const handles = new Set<string>(); // To track unique handles

    const users: RSIOrganizationMember[] = [];
    for (const memberElement of $('.member-item').toArray())
    {
      // Skip members with restrictions (redacted or hidden class)
      if ($(memberElement).find('.restriction').length)
        continue;

      const handle = $(memberElement).find('.nick').text().trim();
      if (!handle || handles.has(handle))
        continue;

      handles.add(handle);
      users.push({
        handle,
        display: $(memberElement).find('.name').text().trim(),
        url: HttpClient.toAbsoluteUrl($(memberElement).find('a').attr('href')?.trim()),
        image: HttpClient.toAbsoluteUrl($(memberElement).find('img').attr('src')?.trim()),
        roles: $(memberElement).find('.rolelist li').map((_, role) => $(role).text()).get(),
        rank: $(memberElement).find('.rank').text(),
        stars: Math.floor(parseInt($(memberElement).find('.stars[style]').attr('style')?.match(/:\s*([0-9]*)%/)?.[1] || '0') / 20),
      });
    }

    return users;
  };
}
