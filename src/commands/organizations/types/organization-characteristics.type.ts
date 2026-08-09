import { RSIGetOrgsParams } from './organization-get.request.types';

export type RSIOrganizationArchetype = 'organization' | 'corporation' | 'pmc' | 'faith' | 'syndicate' | 'club ';
export type RSIOrganizationLanguage = string;
export type RSIOrganizationCommitment = 'casual' | 'regular' | 'hardcore';
export type RSIOrganizationActivity = 'bounty hunting' | 'engineering' | 'exploration' | 'freelancing' | 'infiltration' | 'medical' | 'piracy' | 'resources' | 'scouting' | 'security' | 'smuggling' | 'social' | 'trading' | 'transport ';

export type RSIOrganizationCharacteristics = {
  archetype: RSIOrganizationArchetype | undefined;
  language: RSIOrganizationLanguage | undefined;
  commitment: RSIOrganizationCommitment | undefined;
  isRecruiting: boolean | undefined;
  isRoleplay: boolean | undefined;
  membersCount: number | undefined;
};

/**
 * Organization search result
 */
export type RSIOrganizationSearchResult = {
  sid: string | undefined;
  name: string | undefined;
  icon: string | undefined;
  href: string | undefined;

  characteristics: RSIOrganizationCharacteristics;
};

export type RSIOrganizationSearch = {
  params: RSIGetOrgsParams | undefined;
  result: RSIOrganizationSearchResult[];
};
