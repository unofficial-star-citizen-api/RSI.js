import type { RSIResourceMeta } from '@/types/resource-meta.interface';

/**
 * A member of an organization, returned by {@link Organizations.searchMembers}.
 *
 * @category Types/Organizations
 */
export interface RSIOrganizationMember
{
  /** Citizen handle */
  handle: string | undefined;
  /** Display name */
  display: string | undefined;
  /** Resource metadata; `meta.url` is the citizen page */
  meta: RSIResourceMeta;
  /** Absolute URL of the avatar */
  image: string | undefined;
  /** Roles held in the organization, for example `['Founder', 'Officer']`; empty when none */
  roles: string[] | undefined;
  /** Rank title in the organization */
  rank: string | undefined;
  /** Rank as a number of stars (0 to 5) */
  stars: number | undefined;
}

/**
 * Parameters for {@link Organizations.searchMembers}.
 *
 * @category Types/Organizations
 */
export interface OrganizationMembersSearchParams
{
  /**
   * Spectrum identifier (SID) of the organization, for example `PROTECTORA`
   */
  sid: string;

  /**
   * Free-text query on the member handle or display name
   */
  search?: string;

  /**
   * Only return members with this rank, starting at 1
   */
  rankIndex?: string;

  /**
   * Only return members with this role, starting at 1
   */
  roleIndex?: number;

  /**
   * Only return members whose main organization is this one
   */
  isMainOrg?: boolean;

  /**
   * Page number, starting at 1
   */
  page?: number;
};
