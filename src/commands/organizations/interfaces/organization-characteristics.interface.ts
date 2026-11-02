import type { RSIResourceMeta } from '@/types/resource-meta.interface';

/**
 * Characteristics of an organization in the search results.
 *
 * @category Types/Organizations
 */
export interface RSIOrganizationCharacteristics
{
  /**
   * Archetype, for example {@link RSIOrganizationCharacteristicsArchetype.Syndicate}
   */
  archetype: RSIOrganizationCharacteristicsArchetype | undefined;
  /** Main language, for example `English` */
  language: string | undefined;
  /**
   * Commitment level, for example {@link RSIOrganizationCharacteristicsCommitment.Hardcore}
   */
  commitment: RSIOrganizationCharacteristicsCommitment | undefined;
  /** Whether the organization is recruiting */
  isRecruiting: boolean | undefined;
  /** Whether the organization does role play */
  isRoleplay: boolean | undefined;
  /** Number of members; `NaN` if RSI does not show it */
  membersCount: number | undefined;
}

/**
 * Organization archetypes.
 *
 * @category Types/Organizations
 */
export enum RSIOrganizationCharacteristicsArchetype
{
  Organization = 'Organization',
  Corporation = 'Corporation',
  PMC = 'PMC',
  Faith = 'Faith',
  Syndicate = 'Syndicate',
  Club = 'Club'
}

/**
 * Organization commitment levels.
 *
 * @category Types/Organizations
 */
export enum RSIOrganizationCharacteristicsCommitment
{
  Casual = 'Casual',
  Regular = 'Regular',
  Hardcore = 'Hardcore'
}

/**
 * Organization activities (focus areas).
 *
 * @category Types/Organizations
 */
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
 * An organization in the results of {@link Organizations.search}.
 *
 * @category Types/Organizations
 */
export interface RSIOrganizationSearch
{
  /** Spectrum identifier (SID), for example `PROTECTORA` */
  sid: string | undefined;
  /** Organization name */
  name: string | undefined;
  /** Absolute URL of the organization logo */
  icon: string | undefined;
  /** Resource metadata; `meta.url` is the organization page */
  meta: RSIResourceMeta;

  /** Archetype, language, commitment, recruiting, role play and member count */
  characteristics: RSIOrganizationCharacteristics;
}
