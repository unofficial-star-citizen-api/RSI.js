import { HttpClient } from '@/http-client';
import { load } from 'cheerio';
import
{
  RSIOrganizationArchetype, RSIOrganizationCommitment, RSIOrganizationSearchResult, RSIResponse
} from './types';
import { RSIGetOrgsParams } from './types/organization-get.request.types';

type ReturnFunction = (params?: RSIGetOrgsParams) => Promise<RSIOrganizationSearchResult[]>;

/**
 * Get organization search results
 * @param httpClient HTTP client
 * @returns Return function to get organization search results
 *
 * @see https://robertsspaceindustries.com/en/community/orgs/listing
 */
export function search(httpClient: HttpClient): ReturnFunction
{
  const urlGetOrgs = 'https://robertsspaceindustries.com/api/orgs/getOrgs';

  return async function (params?: RSIGetOrgsParams): Promise<RSIOrganizationSearchResult[]>
  {
    const response = await httpClient.post<RSIResponse>(urlGetOrgs, params);
    if (response.status !== 200)
    {
      throw new Error(`HTTP request failed while retrieving stats data, status code: ${response.status}`);
    }

    if (response.data.success !== 1)
    {
      throw new Error(`Failed to retrieve organization members: ${response.data.msg}`);
    }

    const $ = load(response.data.data.html);

    const organizations: RSIOrganizationSearchResult[] = [];
    for (const orgElement of $('.org-cell ').toArray())
    {
      organizations.push({
        sid: $(orgElement).find('.symbol').text().trim(),
        name: $(orgElement).find('.name').text().trim(),
        icon: HttpClient.toAbsoluteUrl($(orgElement).find('.thumb img').attr('src')),
        href: HttpClient.toAbsoluteUrl($(orgElement).find('a').attr('href')),
        characteristics: {
          archetype: $(orgElement).find('.label:contains("Archetype")').next().text().trim() as RSIOrganizationArchetype,
          commitment: $(orgElement).find('.label:contains("Commitment")').next().text().trim() as RSIOrganizationCommitment,
          language: $(orgElement).find('.label:contains("Lang")').next().text().trim(),
          isRecruiting: $(orgElement).find('.label:contains("Recruiting")').next().text().trim().toLowerCase() === 'yes',
          isRoleplay: $(orgElement).find('.label:contains("Role play")').next().text().trim().toLowerCase() === 'yes',
          membersCount: parseInt($(orgElement).find('.label:contains("Members")').next().text().trim())
        }
      });
    }

    return organizations;
  };
}
