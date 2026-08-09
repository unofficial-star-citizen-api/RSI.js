import { OrganizationMembersSearchParams } from '../organization-search-members';

export type RSIOrganizationSearchMembers = {
  params: OrganizationMembersSearchParams;
  result: RSIOrganizationMemberData[];
};

export type RSIOrganizationMemberData = {
  handle: string | undefined;
  display: string | undefined;
  url: string | undefined;
  image: string | undefined;
  roles: string[] | undefined;
  rank: string | undefined;
  stars: number | undefined;
};