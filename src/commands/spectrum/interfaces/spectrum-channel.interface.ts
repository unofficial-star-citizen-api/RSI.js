import type { RSIResourceMeta } from '@/types/resource-meta.interface';

/**
 * A forum channel of a Spectrum community, returned by {@link Spectrum.getChannels}.
 *
 * @category Types/Spectrum
 */
export interface RSISpectrumChannel
{
  /** Resource metadata; `meta.url` is the channel page */
  meta: RSIResourceMeta;
  /** Channel ID, for example `190048` for Patch Notes */
  id: number;
  /** ID of the community the channel belongs to */
  communityId: number;
  /** Channel name, for example `Patch Notes` */
  name: string;
  /** Channel description */
  description: string | undefined;
  /** Number of threads in the channel */
  threadCount: number;
  /** Display order of the channel in its community */
  order: number;
  /** Labels threads of this channel can be tagged with */
  labels: RSISpectrumLabel[];
}

/**
 * A thread label of a Spectrum channel.
 *
 * @category Types/Spectrum
 */
export interface RSISpectrumLabel
{
  /** Label ID, usable as {@link RSISpectrumThreadsParams.labelId} */
  id: number;
  /** Label name, for example `Patch Notes`; `undefined` when RSI only returns the ID */
  name: string | undefined;
}

/**
 * Well-known forum channel IDs of the Star Citizen community.
 * Call {@link Spectrum.getChannels} for the full list.
 *
 * @category Types/Spectrum
 */
export enum RSISpectrumChannelId
{
  /** Announcements */
  Announcements = 1,
  /** General */
  General = 3,
  /** Feedback */
  Feedback = 4,
  /** Ask The Devs */
  AskTheDevs = 50259,
  /** Patch notes for every LIVE, PTU and ETF release, posted by CIG */
  PatchNotes = 190048,
}
