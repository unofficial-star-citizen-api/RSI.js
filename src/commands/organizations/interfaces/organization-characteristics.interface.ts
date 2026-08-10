export interface RSIOrganizationCharacteristics
{
  archetype: RSIOrganizationCharacteristicsArchetype | undefined;
  language: string | undefined;
  commitment: RSIOrganizationCharacteristicsCommitment | undefined;
  isRecruiting: boolean | undefined;
  isRoleplay: boolean | undefined;
  membersCount: number | undefined;
}

export enum RSIOrganizationCharacteristicsArchetype
{
  Organization = 'organization',
  Corporation = 'corporation',
  PMC = 'pmc',
  Faith = 'faith',
  Syndicate = 'syndicate',
  Club = 'club'
}

export enum RSIOrganizationCharacteristicsCommitment
{
  Casual = 'casual',
  Regular = 'regular',
  Hardcore = 'hardcore'
}

export enum RSIOrganizationCharacteristicsActivity
{
  BountyHunting = 'bounty hunting',
  Engineering = 'engineering',
  Exploration = 'exploration',
  Freelancing = 'freelancing',
  Infiltration = 'infiltration',
  Medical = 'medical',
  Piracy = 'piracy',
  Resources = 'resources',
  Scouting = 'scouting',
  Security = 'security',
  Smuggling = 'smuggling',
  Social = 'social',
  Trading = 'trading',
  Transport = 'transport'
}

/**
 * Organization search result
 */
export interface RSIOrganizationSearch
{
  sid: string | undefined;
  name: string | undefined;
  icon: string | undefined;
  href: string | undefined;

  characteristics: RSIOrganizationCharacteristics;
}
