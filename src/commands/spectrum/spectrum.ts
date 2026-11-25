import {
  RSIError, RSIHttpError, RSINotFoundError 
} from '@/errors';
import { HttpClient } from '@/http-client';
import { createLogger } from '@/logger';
import {
  RSISpectrumChannelNotFoundError, RSISpectrumCommunityNotFoundError, RSISpectrumThreadNotFoundError 
} from './errors';
import { SpectrumContentHelper } from './helpers/spectrum-content.helper';
import
{
  RSISpectrumBadge,
  RSISpectrumChannel,
  RSISpectrumCommunity,
  RSISpectrumCommunityId,
  RSISpectrumLabel,
  RSISpectrumMember,
  RSISpectrumThread,
  RSISpectrumThreadDetails,
  RSISpectrumThreadSort,
  RSISpectrumThreadsParams
} from './interfaces';
import
{
  SpectrumRawBadge,
  SpectrumRawChannel,
  SpectrumRawCommunity,
  SpectrumRawLabel,
  SpectrumRawMemberV1,
  SpectrumRawMemberV2,
  SpectrumRawResponse,
  SpectrumRawThreadV1,
  SpectrumRawThreadV2
} from './interfaces/raw/spectrum-raw.interface';

/**
 * Spectrum, RSI's community forum: communities, forum channels, threads and their content.
 * Access it through {@link RSI.spectrum}.
 *
 * Only public content is available: every request is anonymous.
 *
 * @category Commands
 * @hideconstructor
 * @see https://robertsspaceindustries.com/spectrum/community/SC
 *
 * @example
 * ```typescript
 * import { RSI, RSISpectrumChannelId } from '@unofficial-star-citizen-api/rsi.js';
 *
 * const rsi = new RSI();
 *
 * const [latest] = await rsi.spectrum.getThreads(RSISpectrumChannelId.PatchNotes);
 * const thread = await rsi.spectrum.getThread(latest.slug);
 *
 * console.log(thread.subject, thread.text);
 * ```
 */
export class Spectrum
{
  private readonly urlCommunities = 'https://robertsspaceindustries.com/api/spectrum/v2/community/list';
  private readonly urlChannels = 'https://robertsspaceindustries.com/api/spectrum/v2/forum/channel/list';
  private readonly urlThreads = 'https://robertsspaceindustries.com/api/spectrum/v2/forum/channel/threads';
  // Thread content has no v2 endpoint: the Spectrum web app still uses this one
  private readonly urlThread = 'https://robertsspaceindustries.com/api/spectrum/forum/thread/nested';

  /** Community slugs used to build page URLs; the API does not return them with threads */
  private static readonly communitySlugs: Record<number, string> = {
    [RSISpectrumCommunityId.StarCitizen]: 'SC'
  };

  private readonly httpClient: HttpClient;
  private readonly logger = createLogger(Spectrum.name);

  /** @hidden */
  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  /**
   * Get the public Spectrum communities.
   *
   * @returns The communities
   * @throws {@link RSIHttpError} if RSI cannot be reached or answers with a non-200 status
   * @throws {@link RSIError} if RSI answers with an unsuccessful payload
   *
   * @example
   * ```typescript
   * import { RSI } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   * const communities = await rsi.spectrum.getCommunities();
   *
   * console.log(communities.map(community => `${community.id}: ${community.name}`)); // [ '1: Star Citizen' ]
   * ```
   */
  public async getCommunities(): Promise<RSISpectrumCommunity[]>
  {
    this.logger.info('Fetching Spectrum communities');

    const communities = this.assertArray(await this.request<SpectrumRawCommunity[]>(this.urlCommunities, {}), 'communities');

    return communities.map(community => ({
      meta: {
        url: HttpClient.toAbsoluteUrl(community.url) ?? `${HttpClient.host}/spectrum/community/${community.slug}`
      },
      id: community.id,
      slug: community.slug,
      name: community.name,
      type: community.type || undefined,
      avatar: HttpClient.toAbsoluteUrl(community.avatar || undefined),
      banner: HttpClient.toAbsoluteUrl(community.banner || undefined)
    }));
  }

  /**
   * Get the forum channels of a community.
   *
   * @param communityId - Community ID (default {@link RSISpectrumCommunityId.StarCitizen})
   * @returns The channels, in display order
   * @throws Error if `communityId` is not a positive integer
   * @throws {@link RSISpectrumCommunityNotFoundError} if no community has this ID
   * @throws {@link RSIHttpError} if RSI cannot be reached or answers with a non-200 status
   * @throws {@link RSIError} if RSI answers with an unsuccessful payload
   *
   * @example
   * ```typescript
   * import { RSI } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   * const channels = await rsi.spectrum.getChannels();
   *
   * const patchNotes = channels.find(channel => channel.name === 'Patch Notes');
   * console.log(patchNotes?.id, patchNotes?.threadCount); // 190048 779
   * ```
   */
  public async getChannels(communityId: number = RSISpectrumCommunityId.StarCitizen): Promise<RSISpectrumChannel[]>
  {
    this.assertId(communityId, 'community ID');
    this.logger.info('Fetching Spectrum channels', { communityId });

    const channels = this.assertArray(await this.request<SpectrumRawChannel[]>(
      this.urlChannels,
      { community_id: String(communityId) },
      { community_id: () => new RSISpectrumCommunityNotFoundError(communityId) }
    ), 'channels');

    return channels
      .map(channel => ({
        meta: {
          url: HttpClient.toAbsoluteUrl(channel.url) ?? this.channelUrl(channel.communityId, channel.id)
        },
        id: channel.id,
        communityId: channel.communityId,
        name: channel.name,
        description: channel.description || undefined,
        threadCount: channel.threadCount,
        order: channel.order,
        labels: (channel.labels ?? []).map(label => ({ id: label.id, name: label.name }))
      }))
      .sort((a, b) => a.order - b.order);
  }

  /**
   * Get a page of threads of a forum channel.
   *
   * Pinned threads come first and are only returned on page `1`; pages after the first
   * hold the next threads of the channel in the requested order.
   *
   * Thread page URLs (`meta.url`) assume a channel of the Star Citizen community, the only
   * public one.
   *
   * @param channelId - Channel ID, for example {@link RSISpectrumChannelId.PatchNotes}
   * @param params - Page, sort order and label filter
   * @returns The threads of the page; an empty array past the last page
   * @throws Error if `channelId`, `params.page` or `params.labelId` is not a positive integer
   * @throws {@link RSISpectrumChannelNotFoundError} if no channel has this ID
   * @throws {@link RSIHttpError} if RSI cannot be reached or answers with a non-200 status
   * @throws {@link RSIError} if RSI answers with an unsuccessful payload
   *
   * @example
   * ```typescript
   * import { RSI, RSISpectrumChannelId, RSISpectrumThreadSort } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   * const threads = await rsi.spectrum.getThreads(RSISpectrumChannelId.PatchNotes, { page: 1, sort: RSISpectrumThreadSort.Newest });
   *
   * for (const thread of threads)
   *   console.log(thread.createdAt, thread.subject); // 2026-11-24T... [Wave 3] Star Citizen Alpha 5.0 PTU Patch Notes 13273298
   * ```
   */
  public async getThreads(channelId: number, params: RSISpectrumThreadsParams = {}): Promise<RSISpectrumThread[]>
  {
    const {
      page = 1, sort = RSISpectrumThreadSort.Newest, labelId 
    } = params;
    this.assertId(channelId, 'channel ID');
    this.assertId(page, 'page');
    if (labelId !== undefined)
      this.assertId(labelId, 'label ID');

    this.logger.info('Fetching Spectrum threads', {
      channelId, page, sort, labelId 
    });

    const threads = this.assertArray(await this.request<SpectrumRawThreadV2[]>(
      this.urlThreads,
      {
        channel_id: String(channelId), page, sort, label_id: labelId === undefined ? null : String(labelId) 
      },
      { channel_id: () => new RSISpectrumChannelNotFoundError(channelId) }
    ), 'threads');

    return threads
      // RSI repeats the pinned threads on every page
      .filter(thread => page === 1 || !thread.isPinned)
      .map(thread => ({
        meta: {
          url: this.threadUrl(RSISpectrumCommunityId.StarCitizen, thread.channelId, thread.slug)
        },
        id: thread.id,
        slug: thread.slug,
        subject: thread.subject,
        channelId: thread.channelId,
        label: this.toLabel(thread.label),
        author: this.toMemberV2(thread.member),
        createdAt: this.toIsoDate(thread.createdAt),
        modifiedAt: this.toIsoDate(thread.modifiedAt),
        isPinned: thread.isPinned,
        isLocked: thread.isLocked,
        isErased: thread.isErased,
        repliesCount: thread.repliesCount,
        viewsCount: thread.viewsCount,
        votes: thread.votes?.count ?? 0,
        firstTrackedReplyId: thread.firstTrackedReplyId ?? undefined
      }));
  }

  /**
   * Get a thread with the content of its opening post.
   *
   * Replies are not included, only the references of the replies tracked by RSI
   * (usually CIG employee answers).
   *
   * @param slug - Thread slug, for example `star-citizen-alpha-4-10-live-hotfix-central`
   * @returns The thread and its content
   * @throws Error if `slug` is not a valid thread slug
   * @throws {@link RSISpectrumThreadNotFoundError} if no thread has this slug
   * @throws {@link RSIHttpError} if RSI cannot be reached or answers with a non-200 status
   * @throws {@link RSIError} if RSI answers with an unsuccessful payload
   *
   * @example
   * ```typescript
   * import { RSI } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   * const thread = await rsi.spectrum.getThread('star-citizen-alpha-4-10-live-hotfix-central');
   *
   * console.log(thread.text.split('\n').find(line => line.startsWith('Latest LIVE Client CL'))); // Latest LIVE Client CL: 13220821
   * console.log(thread.trackedReplies); // [ { id: 9118520, author: 'Bault-CIG' } ]
   * ```
   */
  public async getThread(slug: string): Promise<RSISpectrumThreadDetails>
  {
    if (typeof slug !== 'string' || !/^[a-z0-9][a-z0-9_-]{0,254}$/i.test(slug))
      throw new Error(`Invalid Spectrum thread slug: "${slug}"`);

    this.logger.info('Fetching Spectrum thread', { slug });

    const thread = await this.request<SpectrumRawThreadV1>(
      this.urlThread,
      {
        slug, sort: RSISpectrumThreadSort.Newest, target_reply_id: null 
      },
      { slug: () => new RSISpectrumThreadNotFoundError(slug) }
    );
    if (thread == null || typeof thread !== 'object' || Array.isArray(thread))
      throw new RSIError(`Spectrum returned no thread data for "${slug}"`);

    if (!thread.content_blocks?.length && thread.lexical_content != null)
      this.logger.warn('Thread content is only available in the unsupported Lexical format', { slug });

    const content = SpectrumContentHelper.parse(thread.content_blocks ?? []);
    const trackedReplies = (thread.tracked_replies_references ?? [])
      .map(reference => ({ id: Number(reference.id), author: reference.label || undefined }))
      .sort((a, b) => a.id - b.id);
    const communityId = Number(thread.community_id);
    const channelId = Number(thread.channel_id);

    return {
      meta: {
        url: this.threadUrl(communityId, channelId, thread.slug)
      },
      id: Number(thread.id),
      slug: thread.slug,
      subject: thread.subject,
      communityId,
      channelId,
      label: this.toLabel(thread.label_id),
      author: this.toMemberV1(thread.member),
      createdAt: this.toIsoDate(thread.time_created),
      modifiedAt: this.toIsoDate(thread.time_modified),
      isPinned: thread.is_pinned,
      isLocked: thread.is_locked,
      isErased: thread.is_erased,
      repliesCount: thread.replies_count,
      viewsCount: thread.views_count,
      votes: thread.votes?.count ?? 0,
      firstTrackedReplyId: trackedReplies.at(0)?.id,
      content,
      text: SpectrumContentHelper.toText(content),
      links: SpectrumContentHelper.toLinks(content),
      trackedReplies
    };
  }

  /**
   * Send a Spectrum API request and unwrap its payload.
   *
   * @param notFound - Not-found error to throw, by the name of the field RSI rejects
   */
  private async request<T>(url: string, payload: object, notFound: Record<string, () => RSINotFoundError> = {}): Promise<T>
  {
    const response = await this.httpClient.post<SpectrumRawResponse<T>>(url, payload);
    if (response.status !== 200)
      throw new RSIHttpError(`HTTP request failed while retrieving Spectrum data, status code: ${response.status}`, response.status, url);

    const body = response.data;
    if (body?.success !== 1)
    {
      // Unknown IDs and slugs are reported as validation failures of the matching field: { slug: 'Invalid thread slug' }
      const fields = body?.code === 'ErrValidationFailed' && body.data && typeof body.data === 'object' ? Object.keys(body.data) : [];
      const field = fields.find(name => notFound[name]);
      if (field)
        throw notFound[field]();

      throw new RSIError(`Spectrum query failed (${body?.code}: ${body?.msg})${fields.length ? ` ${JSON.stringify(body.data)}` : ''}`);
    }

    return body.data as T;
  }

  private assertArray<T>(data: T[], what: string): T[]
  {
    if (!Array.isArray(data))
      throw new RSIError(`Spectrum returned no ${what} list`);
    return data;
  }

  private assertId(value: number, name: string): void
  {
    if (!Number.isInteger(value) || value < 1)
      throw new Error(`Invalid Spectrum ${name}: "${value}", expected a positive integer`);
  }

  private channelUrl(communityId: number, channelId: number): string | undefined
  {
    const community = Spectrum.communitySlugs[communityId];
    return community ? `${HttpClient.host}/spectrum/community/${community}/forum/${channelId}` : undefined;
  }

  private threadUrl(communityId: number, channelId: number, slug: string): string | undefined
  {
    const channel = this.channelUrl(communityId, channelId);
    return channel ? `${channel}/thread/${slug}` : undefined;
  }

  private toIsoDate(seconds: number): string
  {
    return new Date(seconds * 1000).toISOString();
  }

  private toLabel(label: SpectrumRawLabel): RSISpectrumLabel | undefined
  {
    if (label == null || label === '')
      return undefined;

    if (typeof label === 'object')
      return { id: Number(label.id), name: label.name || undefined };

    return { id: Number(label), name: undefined };
  }

  private toBadges(badges: SpectrumRawBadge[] | undefined): RSISpectrumBadge[]
  {
    return (badges ?? []).map(badge => ({
      name: badge.name,
      icon: HttpClient.toAbsoluteUrl(badge.icon || undefined),
      url: HttpClient.toAbsoluteUrl(badge.url || undefined)
    }));
  }

  private toMember(id: number, handle: string, displayName: string, avatar: string | null, isGM: boolean, badges: SpectrumRawBadge[] | undefined): RSISpectrumMember
  {
    return {
      meta: {
        url: `${HttpClient.host}/citizens/${encodeURIComponent(handle)}`
      },
      id,
      handle,
      displayName,
      avatar: HttpClient.toAbsoluteUrl(avatar || undefined),
      isGM,
      badges: this.toBadges(badges)
    };
  }

  private toMemberV2(member: SpectrumRawMemberV2): RSISpectrumMember
  {
    return this.toMember(member.id, member.nickname, member.displayname, member.avatar, member.isGm, member.meta?.badges);
  }

  private toMemberV1(member: SpectrumRawMemberV1): RSISpectrumMember
  {
    return this.toMember(Number(member.id), member.nickname, member.displayname, member.avatar, member.isGM, member.meta?.badges);
  }
}
