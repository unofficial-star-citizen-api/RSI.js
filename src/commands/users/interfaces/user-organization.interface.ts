import type { RSIResourceMeta } from '@/types/resource-meta.interface';

/**
 * A citizen's organizations, returned by {@link Users.getOrganization}.
 *
 * @category Types/Users
 */
export interface RSIUserOrganization
{
  /** The citizen's main organization */
  organization: RSIMainOrganization;
  /** Other public affiliations; redacted ones are skipped */
  affiliations: RSIAffiliationOrganization[];
}

/**
 * Main organization of a citizen.
 *
 * @category Types/Users
 */
export interface RSIMainOrganization
{
  /** Identity of the organization and the citizen's rank in it */
  info: RSIMainOrganizationInfo;
  /** Organization characteristics shown on the citizen page */
  characteristics: RSIMainOrganizationCharacteristics;
}

/**
 * Identity of a citizen's main organization and the citizen's rank in it.
 *
 * @category Types/Users
 */
export interface RSIMainOrganizationInfo
{
  /** Resource metadata; `meta.url` is the organization page */
  meta: RSIResourceMeta;
  /** Spectrum identifier (SID) of the organization */
  sid: string | undefined;
  /** Organization name */
  name: string | undefined;
  /** The citizen's rank title in the organization */
  rank: string | undefined;
  /** The citizen's rank as a number of stars (0 to 5) */
  stars: number | undefined;
  /** Absolute URL of the organization logo */
  image: string | undefined;
  /** Number of members; `NaN` if RSI does not show it */
  members: number | undefined;
}

/**
 * Characteristics of a citizen's main organization.
 *
 * @category Types/Users
 */
export interface RSIMainOrganizationCharacteristics
{
  /** Archetype, for example `Corporation` or `PMC` */
  archetype: string | undefined;
  /** Primary language */
  primaryLanguage: string | undefined;
  /** Primary activity, for example `Social` */
  primaryActivity: string | undefined;
  /** Whether the organization is recruiting */
  recruiting: boolean | undefined;
  /** Secondary activity */
  sectorOfActivity: string | undefined;
  /** Whether the organization does role play */
  roleplay: boolean | undefined;
  /** Commitment level, for example `Casual` or `Regular` */
  commitment: string | undefined;
  /** Whether membership is exclusive */
  exclusive: boolean | undefined;
}

/**
 * An organization a citizen is affiliated with (other than the main one).
 *
 * @category Types/Users
 */
export interface RSIAffiliationOrganization
{
  /** Spectrum identifier (SID) of the organization */
  sid: string | undefined;
  /** Organization name */
  name: string | undefined;
  /** The citizen's rank title in the organization */
  rank: string | undefined;
  /** The citizen's rank as a number of stars (0 to 5) */
  stars: number | undefined;
  /** Absolute URL of the organization logo */
  image: string | undefined;
  /** Number of members; `NaN` if RSI does not show it */
  members: number | undefined;
}
