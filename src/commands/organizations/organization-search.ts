import { HttpClient } from '@/http-client';
import { load } from 'cheerio';
import
{
  RSIOrganizationCharacteristicsArchetype, RSIOrganizationCharacteristicsCommitment,
  RSIOrganizationResponse,
  RSIOrganizationSearch, RSIOrganizationSearchParams
} from './interfaces';

type ReturnFunction = (params?: RSIOrganizationSearchParams) => Promise<RSIOrganizationSearch[]>;

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

  return async function (params?: RSIOrganizationSearchParams): Promise<RSIOrganizationSearch[]>
  {
    const response = await httpClient.post<RSIOrganizationResponse>(urlGetOrgs, params);
    if (response.status !== 200)
    {
      throw new Error(`HTTP request failed while retrieving organization data, status code: ${response.status}`);
    }

    if (response.data.success !== 1)
    {
      throw new Error(`Failed to retrieve organization: ${response.data.msg}`);
    }

    const $ = load(response.data.data.html);

    const organizations: RSIOrganizationSearch[] = [];
    for (const orgElement of $('.org-cell ').toArray())
    {
      organizations.push({
        sid: $(orgElement).find('.symbol').text().trim(),
        name: $(orgElement).find('.name').text().trim(),
        icon: HttpClient.toAbsoluteUrl($(orgElement).find('.thumb img').attr('src')),
        href: HttpClient.toAbsoluteUrl($(orgElement).find('a').attr('href')),
        characteristics: {
          archetype: $(orgElement).find('.label:contains("Archetype")').next().text().trim() as RSIOrganizationCharacteristicsArchetype,
          commitment: $(orgElement).find('.label:contains("Commitment")').next().text().trim() as RSIOrganizationCharacteristicsCommitment,
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
