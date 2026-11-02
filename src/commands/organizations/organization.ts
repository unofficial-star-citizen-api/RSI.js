import { HttpClient } from '@/http-client';
import { get as getFunction } from './organization-get';
import { search as searchFunction } from './organization-search';
import { searchMembers as searchMembersFunction } from './organization-search-members';
import {
  OrganizationMembersSearchParams,
  RSIOrganization,
  RSIOrganizationMember,
  RSIOrganizationSearch,
  RSIOrganizationSearchParams
} from './interfaces';

/**
 * Organization details, search and member lists.
 * Access it through {@link RSI.organizations}.
 *
 * @category Commands
 * @hideconstructor
 * @see https://robertsspaceindustries.com/community/orgs
 */
export class Organizations
{
  /**
   * Get an organization's public page: name, logo, banner, member count, archetype,
   * commitment, focus, headline, history, manifesto and charter.
   *
   * @param sid - Spectrum identifier (SID) of the organization, for example `PROTECTORA`
   * @returns The organization
   * @throws {@link RSIOrganizationNotFoundError} if no organization has this SID
   * @throws {@link RSIError} if RSI answers with another non-200 status or the page cannot be parsed
   *
   * @example
   * ```typescript
   * import { RSI } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   * const org = await rsi.organizations.get('PROTECTORA');
   *
   * console.log(org.name, org.membersCount, org.focus.primary.name);
   * console.log(org.manifesto.plaintext);
   * ```
   */
  public readonly get: (sid: string) => Promise<RSIOrganization>;

  /**
   * Search the organization directory. Returns one page of results.
   *
   * @param params - Filters, sort order and page; omit to list the first page of every organization
   * @returns The organizations on the requested page
   * @throws {@link RSIError} if RSI answers with a non-200 status or rejects the search
   *
   * @example
   * ```typescript
   * import {
   *   RSI,
   *   RSIOrganizationSearchParamsActivities,
   *   RSIOrganizationSearchParamsBoolean,
   *   RSIOrganizationSearchParamsLanguage,
   *   RSIOrganizationSearchParamsSort,
   * } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   * const orgs = await rsi.organizations.search({
   *   search: 'mining',
   *   activity: [RSIOrganizationSearchParamsActivities.Resources],
   *   languages: [RSIOrganizationSearchParamsLanguage.French],
   *   recruiting: [RSIOrganizationSearchParamsBoolean.Yes],
   *   sort: RSIOrganizationSearchParamsSort.SizeDesc,
   *   page: 1,
   * });
   *
   * console.log(orgs.map(org => `${org.sid}: ${org.characteristics.membersCount} members`));
   * ```
   */
  public readonly search: (params?: RSIOrganizationSearchParams) => Promise<RSIOrganizationSearch[]>;

  /**
   * List the visible members of an organization. Returns one page of results.
   * Redacted and hidden members are skipped, and duplicate handles are removed.
   *
   * @param params - Organization SID, plus optional search, rank, role and paging filters
   * @returns The members on the requested page
   * @throws {@link RSIOrganizationNotFoundError} if no organization has this SID
   * @throws {@link RSIError} if RSI answers with another non-200 status or rejects the request
   *
   * @example
   * ```typescript
   * import { RSI } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   * const members = await rsi.organizations.searchMembers({ sid: 'PROTECTORA', search: 'Dymerz' });
   *
   * console.log(members.map(member => `${member.handle} (${member.rank}, ${member.stars} stars)`));
   * ```
   */
  public readonly searchMembers: (params: OrganizationMembersSearchParams) => Promise<RSIOrganizationMember[]>;

  /** @hidden */
  constructor(httpClient: HttpClient)
  {
    this.get = getFunction(httpClient, Organizations.name);
    this.search = searchFunction(httpClient, Organizations.name);
    this.searchMembers = searchMembersFunction(httpClient, Organizations.name);
  }
}
