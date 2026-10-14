import type { RSIResourceMeta } from '@/types/resource-meta.interface';

export interface RSIOrganizationMember
{
  handle: string | undefined;
  display: string | undefined;
  meta: RSIResourceMeta;
  image: string | undefined;
  roles: string[] | undefined;
  rank: string | undefined;
  stars: number | undefined;
}


export interface OrganizationMembersSearchParams
{
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