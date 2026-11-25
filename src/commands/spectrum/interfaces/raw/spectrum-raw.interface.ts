/*
 * Raw Spectrum API types. Private to the spectrum module: they are not exported from the package.
 *
 * Lists come from the v2 API (camelCase, numeric IDs); thread content only exists in the v1 API
 * (snake_case, string IDs).
 */

/** Envelope of every Spectrum API response. On failure `data` holds `{ field: reason }` */
export interface SpectrumRawResponse<T>
{
  success: number;
  code: string;
  msg: string;
  data: T | Record<string, string> | null;
}

export interface SpectrumRawBadge
{
  name: string;
  icon?: string;
  url?: string;
}

export interface SpectrumRawCommunity
{
  id: number;
  name: string;
  slug: string;
  type?: string;
  avatar?: string;
  banner?: string;
  url?: string;
}

export interface SpectrumRawChannel
{
  id: number;
  communityId: number;
  name: string;
  description?: string;
  order: number;
  threadCount: number;
  labels?: { id: number; channelId: number; name: string; }[];
  url?: string;
}

export interface SpectrumRawMemberV2
{
  id: number;
  displayname: string;
  nickname: string;
  avatar: string | null;
  isGm: boolean;
  meta?: { badges?: SpectrumRawBadge[]; };
}

/** Shape of a non-null label is not documented by RSI: an object with an ID, and maybe a name */
export type SpectrumRawLabel = { id: number | string; name?: string; } | number | string | null;

export interface SpectrumRawThreadV2
{
  id: number;
  channelId: number;
  slug: string;
  subject: string;
  createdAt: number;
  modifiedAt: number;
  isPinned: boolean;
  isLocked: boolean;
  isErased: boolean;
  repliesCount: number;
  viewsCount: number;
  votes: { count: number; voted: boolean; };
  label: SpectrumRawLabel;
  member: SpectrumRawMemberV2;
  firstTrackedReplyId: number | null;
}

export interface SpectrumRawMemberV1
{
  id: string;
  displayname: string;
  nickname: string;
  avatar: string | null;
  isGM: boolean;
  meta?: { badges?: SpectrumRawBadge[]; };
}

export interface SpectrumRawThreadV1
{
  id: string;
  time_created: number;
  time_modified: number;
  channel_id: string;
  community_id: string;
  label_id: string | null;
  slug: string;
  subject: string;
  is_locked: boolean;
  is_pinned: boolean;
  is_erased: boolean;
  member: SpectrumRawMemberV1;
  replies_count: number;
  views_count: number;
  votes: { count: number; voted: number; };
  content_blocks: SpectrumRawContentBlock[] | null;
  lexical_content: unknown;
  tracked_replies_references: { id: string; label: string; }[] | null;
}

/** A content block; `data` depends on `type` (Draft.js text, image uploads or a video embed) */
export interface SpectrumRawContentBlock
{
  id: number | string;
  type: string;
  data: unknown;
}

export interface SpectrumRawDraftContent
{
  blocks: SpectrumRawDraftBlock[];
  /** An array indexed by entity key, or an object keyed by entity key */
  entityMap: SpectrumRawDraftEntity[] | Record<string, SpectrumRawDraftEntity>;
}

export interface SpectrumRawDraftBlock
{
  key: string;
  text: string;
  type: string;
  depth: number;
  inlineStyleRanges: { offset: number; length: number; style: string; }[];
  entityRanges: { offset: number; length: number; key: number; }[];
}

export interface SpectrumRawDraftEntity
{
  type: string;
  mutability: string;
  data: { href?: string; url?: string; } | string;
}

export interface SpectrumRawUpload
{
  id: string;
  type: string;
  data: {
    url: string;
    image_width?: number | string;
    image_height?: number | string;
    sizes?: Record<string, { url: string; }>;
  };
}

export interface SpectrumRawEmbed
{
  id: string;
  type: string;
  data: {
    url?: string;
    embed_src?: string;
    provider_name?: string;
    title?: string;
    image?: string;
  };
}
