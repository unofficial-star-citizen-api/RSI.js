import { HttpClient } from '@/http-client';
import { RSIError } from '@/errors';
import { createLogger } from '@/logger';
import { load } from 'cheerio';
import { RSIOrganizationNotFoundError } from './errors';
import { OrganizationMembersSearchParams, RSIOrganizationMember } from './interfaces/organization-members.interface';
import { RSIOrganizationResponse } from './interfaces/rsi-response.interface';

type ReturnFunction = (params: OrganizationMembersSearchParams) => Promise<RSIOrganizationMember[]>;

export function searchMembers(httpClient: HttpClient, loggerName = 'Organizations'): ReturnFunction
{
  const urlOrganizationMembers = 'https://robertsspaceindustries.com/api/orgs/getOrgMembers';
  const logger = createLogger(loggerName);

  return async function (params: OrganizationMembersSearchParams): Promise<RSIOrganizationMember[]>
  {
    logger.info('Searching organization members', { sid: params.sid });

    const payload = {
      symbol: params.sid,
      search: params.search,
      rank: params.rankIndex,
      role: params.roleIndex,
      isMainOrg: params.isMainOrg ? 0 : 1,
      page: params.page,
      pageSize: params.pageSize,
    };

    const response = await httpClient.post<RSIOrganizationResponse>(urlOrganizationMembers, payload);
    if (response.status === 404)
    {
      throw new RSIOrganizationNotFoundError(params.sid);
    }

    if (response.status !== 200)
    {
      throw new RSIError(`HTTP request failed while retrieving organization members data, status code: ${response.status}`);
    }

    if (response.data.success !== 1)
    {
      if (response.data.code === 'ErrInvalidOrganization')
        throw new RSIOrganizationNotFoundError(params.sid);

      throw new RSIError(`Failed to retrieve organization members: ${response.data.msg}`);
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
        meta: {
          url: HttpClient.toAbsoluteUrl($(memberElement).find('a').attr('href')?.trim())
        },
        image: HttpClient.toAbsoluteUrl($(memberElement).find('img').attr('src')?.trim()),
        roles: $(memberElement).find('.rolelist li').map((_, role) => $(role).text()).get(),
        rank: $(memberElement).find('.rank').text(),
        stars: Math.floor(parseInt($(memberElement).find('.stars[style]').attr('style')?.match(/:\s*([0-9]*)%/)?.[1] || '0') / 20),
      });
    }

    return users;
  };
}
