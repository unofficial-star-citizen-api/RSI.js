export type OrganizationArchetype = 'organization' | 'corporation' | 'pmc' | 'faith' | 'syndicate' | 'club ';
export type OrganizationLanguage = string;
export type OrganizationCommitment = 'casual' | 'regular' | 'hardcore';
export type OrganizationActivity = 'bounty hunting' | 'engineering' | 'exploration' | 'freelancing' | 'infiltration' | 'medical' | 'piracy' | 'resources' | 'scouting' | 'security' | 'smuggling' | 'social' | 'trading' | 'transport ';

/**
 * Organization search result
 */
export type OrganizationSearchResult = {
  sid: string | undefined;
  name: string | undefined;
  icon: string | undefined;
  href: string | undefined;

  characteristics: {
    archetype: OrganizationArchetype | undefined;
    language: OrganizationLanguage | undefined;
    commitment: OrganizationCommitment | undefined;
    isRecruiting: boolean | undefined;
    isRoleplay: boolean | undefined;
    membersCount: number | undefined;
  };
};
