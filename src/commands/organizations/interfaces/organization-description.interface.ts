import type { RSIResourceMeta } from '@/types/resource-meta.interface';
import { RSIOrganizationCharacteristicsArchetype, RSIOrganizationCharacteristicsCommitment } from './organization-characteristics.interface';

/**
 * An organization's public page, returned by {@link Organizations.get}.
 *
 * @category Types/Organizations
 */
export interface RSIOrganization
{
  /** Spectrum identifier (SID), for example `PROTECTORA` */
  sid: string;
  /** Resource metadata; `meta.url` is the organization page */
  meta: RSIResourceMeta;
  /** Organization name */
  name: string | undefined;

  /** Absolute URL of the logo */
  logo: string | undefined;
  /** Absolute URL of the banner image */
  banner: string | undefined;

  /** Number of members; `NaN` if RSI does not show it */
  membersCount: number | undefined;

  /** Archetype, for example {@link RSIOrganizationCharacteristicsArchetype.Corporation} */
  archetype: RSIOrganizationCharacteristicsArchetype | undefined;

  /** Commitment level, for example {@link RSIOrganizationCharacteristicsCommitment.Regular} */
  commitment: RSIOrganizationCharacteristicsCommitment | undefined;

  /** Primary and secondary activities */
  focus: RSIOrganizationFocusArea;

  /** Short presentation shown at the top of the page */
  headline: RSIOrganizationFormattedContent;
  /** History tab */
  history: RSIOrganizationFormattedContent;
  /** Manifesto tab */
  manifesto: RSIOrganizationFormattedContent;
  /** Charter tab */
  charter: RSIOrganizationFormattedContent;
}

/**
 * Primary and secondary activities of an organization.
 *
 * @category Types/Organizations
 */
export interface RSIOrganizationFocusArea
{
  /** Primary activity */
  primary: RSIOrganizationFocus;
  /** Secondary activity */
  secondary: RSIOrganizationFocus;
}

/**
 * One activity of an organization.
 *
 * @category Types/Organizations
 */
export interface RSIOrganizationFocus
{
  /** Absolute URL of the activity icon */
  image: string | undefined;
  /** Activity name, for example `Social` or `Security` */
  name: string | undefined;
}

/**
 * Text content available both as HTML and as plain text.
 *
 * @category Types/Organizations
 */
export interface RSIOrganizationFormattedContent
{
  /** Raw HTML rendered by RSI */
  html: string | undefined;
  /** Text content without markup */
  plaintext: string | undefined;
}
