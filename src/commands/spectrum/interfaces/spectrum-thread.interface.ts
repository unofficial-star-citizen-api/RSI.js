import type { RSIResourceMeta } from '@/types/resource-meta.interface';
import type { RSISpectrumLabel } from './spectrum-channel.interface';
import type { RSISpectrumContentBlock } from './spectrum-content.interface';

/**
 * A forum thread, as listed by {@link Spectrum.getThreads}.
 *
 * @category Types/Spectrum
 */
export interface RSISpectrumThread
{
  /** Resource metadata; `meta.url` is the thread page */
  meta: RSIResourceMeta;
  /** Thread ID */
  id: number;
  /** Short name used in URLs and by {@link Spectrum.getThread}, for example `star-citizen-alpha-4-10-live-hotfix-central` */
  slug: string;
  /** Thread title */
  subject: string;
  /** ID of the channel the thread belongs to */
  channelId: number;
  /** Label the thread is tagged with, if any */
  label: RSISpectrumLabel | undefined;
  /** Author of the thread */
  author: RSISpectrumMember;
  /** Creation date, as an ISO 8601 string */
  createdAt: string;
  /** Date of the last edit, as an ISO 8601 string */
  modifiedAt: string;
  /** Whether the thread is pinned to the top of its channel */
  isPinned: boolean;
  /** Whether replies are closed */
  isLocked: boolean;
  /** Whether the thread was deleted */
  isErased: boolean;
  /** Number of replies */
  repliesCount: number;
  /** Number of views */
  viewsCount: number;
  /** Number of upvotes */
  votes: number;
  /** ID of the first reply tracked by RSI (usually a CIG employee answer), if any */
  firstTrackedReplyId: number | undefined;
}

/**
 * A forum thread with its content, returned by {@link Spectrum.getThread}.
 *
 * @category Types/Spectrum
 */
export interface RSISpectrumThreadDetails extends RSISpectrumThread
{
  /** ID of the community the thread belongs to */
  communityId: number;
  /** Content of the opening post, block by block */
  content: RSISpectrumContentBlock[];
  /** Plain text of the opening post: every paragraph, one per line */
  text: string;
  /** Every distinct absolute URL linked from the opening post */
  links: string[];
  /** Replies tracked by RSI (usually CIG employee answers), oldest first */
  trackedReplies: RSISpectrumReplyReference[];
}

/**
 * Reference to a reply of a Spectrum thread.
 *
 * @category Types/Spectrum
 */
export interface RSISpectrumReplyReference
{
  /** Reply ID */
  id: number;
  /** Handle of the reply author, for example `Bault-CIG` */
  author: string | undefined;
}

/**
 * A Spectrum member: the author of a thread or a reply.
 *
 * @category Types/Spectrum
 */
export interface RSISpectrumMember
{
  /** Resource metadata; `meta.url` is the member's citizen page */
  meta: RSIResourceMeta;
  /** Spectrum member ID */
  id: number;
  /** Handle, as used in citizen page URLs, for example `Wakapedia-CIG` */
  handle: string;
  /** Display name */
  displayName: string;
  /** Absolute URL of the avatar */
  avatar: string | undefined;
  /** Whether the member is a game master */
  isGM: boolean;
  /** Badges shown next to the member's name, for example `Developer` */
  badges: RSISpectrumBadge[];
}

/**
 * A badge shown next to a Spectrum member's name.
 *
 * @category Types/Spectrum
 */
export interface RSISpectrumBadge
{
  /** Badge name, for example `Developer` */
  name: string;
  /** Absolute URL of the badge icon */
  icon: string | undefined;
  /** Absolute URL the badge links to, if any */
  url: string | undefined;
}

/**
 * Options of {@link Spectrum.getThreads}.
 *
 * @category Types/Spectrum
 */
export interface RSISpectrumThreadsParams
{
  /** Page to read, starting at `1` (default `1`). Pinned threads are only returned on page `1` */
  page?: number;
  /** Sort order (default {@link RSISpectrumThreadSort.Newest}) */
  sort?: RSISpectrumThreadSort;
  /** Only return threads tagged with this label, see {@link RSISpectrumChannel.labels} */
  labelId?: number;
}

/**
 * Sort order of {@link Spectrum.getThreads}.
 *
 * @category Types/Spectrum
 */
export enum RSISpectrumThreadSort
{
  /** Newest threads first */
  Newest = 'newest',
  /** Most active threads first */
  Hot = 'hot',
  /** Most upvoted threads first */
  Votes = 'votes',
}
