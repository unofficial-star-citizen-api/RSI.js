/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContent
{
  success: number;
  code: string;
  msg: string;
  data: RSISpectrumThreadContentData;
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContentData
{
  id: string;
  time_created: number;
  time_modified: number;
  channel_id: string;
  label_id: null;
  type: string;
  slug: string;
  subject: string;
  is_locked: boolean;
  is_reply_nesting_disabled: boolean;
  is_pinned: boolean;
  is_sinked: boolean;
  is_erased: boolean;
  erased_by: null;
  tracked_post_role_id: string;
  content_reply_id: string;
  annotation_plaintext: null;
  subscription_key: string;
  content_blocks: RSISpectrumThreadContentElement[];
  highlight_role_id: string;
  community_id: string;
  member: RSISpectrumThreadContentErasedByClass;
  replies_count: number;
  views_count: number;
  latest: number;
  latest_activity: RSISpectrumThreadContentLatestActivity;
  votes: RSISpectrumThreadContentDataVotes;
  reactions: RSISpectrumThreadContentReaction[];
  tracked_replies_references: unknown[];
  children_replies_references: unknown[];
  notification_subscription: null;
  aspect: string;
  nested_replies_ids: string[];
  replies: RSISpectrumThreadContentReply[];
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContentElement
{
  id: number;
  type: RSISpectrumThreadContentElementType;
  data: RSISpectrumThreadContentElementData;
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContentElementData
{
  blocks: RSISpectrumThreadContentElementDataBlock[];
  entityMap: RSISpectrumThreadContentElementDataEntityMap[];
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContentElementDataBlock
{
  key: string;
  text: string;
  type: RSISpectrumThreadContentElementDataBlockType;
  depth: number;
  inlineStyleRanges: RSISpectrumThreadContentElementDataInlineStyleRange[];
  entityRanges: RSISpectrumThreadContentElementDataEntityRange[];
  data: unknown[];
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContentElementDataEntityRange
{
  offset: number;
  length: number;
  key: number;
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContentElementDataInlineStyleRange
{
  offset: number;
  length: number;
  style: string;
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export enum RSISpectrumThreadContentElementDataBlockType
{
  HeaderOne = 'header-one',
  Unstyled = 'unstyled',
  UnorderedListItem = 'unordered-list-item',
  Blockquote = 'blockquote',
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContentElementDataEntityMap
{
  type: string;
  mutability: string;
  data: RSISpectrumThreadContentElementDataEntityMapData | string;
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContentElementDataEntityMapData
{
  href: string;
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export enum RSISpectrumThreadContentElementType
{
  Image = 'image',
  Text = 'text',
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContentLatestActivity
{
  time_created: number;
  member: RSISpectrumThreadContentLatestActivityMember;
  highlight_role_id: null;
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContentLatestActivityMember
{
  id: string;
  displayname: string;
  nickname: string;
  avatar: null | string;
  signature: string;
  meta: RSISpectrumThreadContentLatestActivityMemberMeta;
  isGM: boolean;
  spoken_languages: string[];
  roles?: RSISpectrumThreadContentLatestActivityMemberRoles;
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContentLatestActivityMemberMeta
{
  badges: RSISpectrumThreadContentLatestActivityMemberMetaBadge[];
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContentLatestActivityMemberMetaBadge
{
  name: string;
  icon: string;
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContentLatestActivityMemberRoles
{
  '1': string[];
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContentErasedByClass
{
  id: string;
  displayname: string;
  nickname: string;
  avatar: null | string;
  signature: RSISpectrumThreadContentErasedByClassSignature;
  meta: RSISpectrumThreadContentErasedByClassMeta;
  isGM: boolean;
  spoken_languages: string[];
  presence?: RSIPresence;
  roles?: { [key: string]: string[]; };
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContentErasedByClassMeta
{
  badges: RSISpectrumThreadContentErasedByClassMetaBadge[];
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContentErasedByClassMetaBadge
{
  name: string;
  icon: string;
  url?: string;
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSIPresence
{
  status: string;
  info: null;
  since: number;
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export enum RSISpectrumThreadContentErasedByClassSignature
{
  TypicalDutch = 'TypicalDutch',
  Empty = '',
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContentReaction
{
  type: string;
  count: number;
  members: { [key: string]: string; };
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContentReply
{
  id: string;
  time_created: number;
  time_modified: number;
  thread_id: string;
  content_blocks: RSISpectrumThreadContentReplyContentBlock[];
  is_erased: boolean;
  erased_by: null;
  annotation_plaintext: null;
  member: RSISpectrumThreadContentReplyMember;
  votes: RSISpectrumThreadContentDataVotes;
  reactions: RSISpectrumThreadContentReaction[];
  parent_reply_reference: null;
  children_replies_references: RSISpectrumThreadContentReplyReference[];
  tracked_replies_references: unknown[];
  read: boolean;
  replies_count: number;
  replies: RSISpectrumThreadContentReplyReply[];
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContentReplyReference
{
  id: string;
  label: string;
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContentReplyContentBlock
{
  id: number | string;
  type: RSISpectrumThreadContentElementType;
  data: RSISpectrumThreadContentReplyContentBlockData[] | RSISpectrumThreadContentElementData;
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContentReplyContentBlockData
{
  id: string;
  type: string;
  data: RSISpectrumThreadContentReplyContentBlockDataData;
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContentReplyContentBlockDataData
{
  url: string;
  image_width: string;
  image_height: string;
  sizes: RSISpectrumThreadContentReplyContentBlockDataDataSizes;
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContentReplyContentBlockDataDataSizes
{
  mini: RSISpectrumThreadContentReplyContentBlockDataDataSizesLarge;
  square: RSISpectrumThreadContentReplyContentBlockDataDataSizesLarge;
  small: RSISpectrumThreadContentReplyContentBlockDataDataSizesLarge;
  medium: RSISpectrumThreadContentReplyContentBlockDataDataSizesLarge;
  large: RSISpectrumThreadContentReplyContentBlockDataDataSizesLarge;
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContentReplyContentBlockDataDataSizesLarge
{
  url: string;
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContentReplyMember
{
  id: string;
  displayname: string;
  nickname: string;
  avatar: null | string;
  signature: string;
  meta: RSISpectrumThreadContentErasedByClassMeta;
  isGM: boolean;
  spoken_languages: string[];
  roles: { [key: string]: string[]; };
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContentReplyReply
{
  id: string;
  time_created: number;
  time_modified: number;
  thread_id: string;
  content_blocks: RSISpectrumThreadContentReplyContentBlock[];
  is_erased: boolean;
  erased_by: null;
  annotation_plaintext: null;
  member: RSISpectrumThreadContentReplyMember;
  votes: RSISpectrumThreadContentDataVotes;
  reactions: unknown[];
  parent_reply_reference: RSISpectrumThreadContentReplyReference;
  children_replies_references: RSISpectrumThreadContentReplyReference[];
  tracked_replies_references: unknown[];
  read: boolean;
  replies_count: number;
  replies: RSISpectrumThreadContentReplyReply[];
}

/**
 * Raw Spectrum API type, not returned by any method.
 * @hidden
 */
export interface RSISpectrumThreadContentDataVotes
{
  count: number;
  voted: number;
}
