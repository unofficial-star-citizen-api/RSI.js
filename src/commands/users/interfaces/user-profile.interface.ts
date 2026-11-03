import type { RSIResourceMeta } from '@/types/resource-meta.interface';

/**
 * A citizen's public profile, returned by {@link Users.getProfile}.
 *
 * @category Types/Users
 */
export interface RSIUserProfile
{
  /** Resource metadata; `meta.url` is the citizen page */
  meta: RSIResourceMeta;
  /** UEE citizen record number, for example `#1461338` */
  id: string | undefined;
  /** Display name (community moniker) */
  display: string | undefined;
  /** Handle, the unique login-style name used in URLs */
  handle: string | undefined;
  /** Badge shown under the display name, if any */
  badge: RSIUserProfileBadge | undefined;
  /** Absolute URL of the avatar */
  image: string | undefined;
  /** Enlistment date as an ISO 8601 string at UTC midnight, for example `2016-08-19T00:00:00.000Z` */
  enlisted: string | undefined;
  /** Location declared on the profile, if any */
  location: RSIUserProfileLocation | undefined;
  /** Languages the citizen speaks; empty when none is declared */
  fluency: string[];
  /** Personal website URL, if any */
  website: string | undefined;
  /** Biography */
  bio: RSIUserProfileBio;
}

/**
 * Profile badge of a citizen.
 *
 * @category Types/Users
 */
export interface RSIUserProfileBadge
{
  /** Badge label, for example `Gold Observer` */
  name: string | undefined;
  /** Absolute URL of the badge icon */
  image: string | undefined;
}

/**
 * Location declared on a citizen profile.
 *
 * @category Types/Users
 */
export interface RSIUserProfileLocation
{
  /** Country, the first part of the location, for example `France` */
  country: string | undefined;
  /** Region or city, the second part of the location, for example `Paris` */
  region: string | undefined;
}

/**
 * Biography of a citizen.
 *
 * @category Types/Users
 */
export interface RSIUserProfileBio
{
  /** Plain-text biography */
  text: string | undefined;
  /** Biography as the raw HTML rendered by RSI */
  html: string | undefined;
}
