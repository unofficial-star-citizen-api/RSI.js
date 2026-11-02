import type { RSIResourceMeta } from '@/types/resource-meta.interface';

/**
 * Characteristics of an organization in the search results.
 *
 * @category Organizations
 */
export interface RSIOrganizationCharacteristics
{
  /**
   * Archetype as displayed by RSI, for example `Syndicate`.
   * The value is not lowercased, so it does not equal the {@link RSIOrganizationCharacteristicsArchetype} members.
   */
  archetype: RSIOrganizationCharacteristicsArchetype | undefined;
  /** Main language, for example `English` */
  language: string | undefined;
  /**
   * Commitment as displayed by RSI, for example `Hardcore`.
   * The value is not lowercased, so it does not equal the {@link RSIOrganizationCharacteristicsCommitment} members.
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
 * @category Organizations
 */
export enum RSIOrganizationCharacteristicsArchetype
{
  Organization = 'organization',
  Corporation = 'corporation',
  PMC = 'pmc',
  Faith = 'faith',
  Syndicate = 'syndicate',
  Club = 'club'
}

/**
 * Organization commitment levels.
 *
 * @category Organizations
 */
export enum RSIOrganizationCharacteristicsCommitment
{
  Casual = 'casual',
  Regular = 'regular',
  Hardcore = 'hardcore'
}

/**
 * Organization activities (focus areas).
 *
 * @category Organizations
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
 * @category Organizations
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
