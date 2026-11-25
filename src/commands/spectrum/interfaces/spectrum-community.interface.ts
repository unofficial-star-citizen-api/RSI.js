import type { RSIResourceMeta } from '@/types/resource-meta.interface';

/**
 * A Spectrum community, returned by {@link Spectrum.getCommunities}.
 *
 * @category Types/Spectrum
 */
export interface RSISpectrumCommunity
{
  /** Resource metadata; `meta.url` is the community page */
  meta: RSIResourceMeta;
  /** Community ID, for example `1` for Star Citizen */
  id: number;
  /** Short name used in URLs, for example `SC` */
  slug: string;
  /** Display name, for example `Star Citizen` */
  name: string;
  /** Community type as reported by RSI, for example `public` */
  type: string | undefined;
  /** Absolute URL of the community avatar */
  avatar: string | undefined;
  /** Absolute URL of the community banner */
  banner: string | undefined;
}

/**
 * Well-known Spectrum community IDs. Call {@link Spectrum.getCommunities} for the full list.
 *
 * @category Types/Spectrum
 */
export enum RSISpectrumCommunityId
{
  /** The Star Citizen community (`SC`) */
  StarCitizen = 1,
}
