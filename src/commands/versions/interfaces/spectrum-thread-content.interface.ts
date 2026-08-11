export interface RSISpectrumThreadContent
{
  success: number;
  code: string;
  msg: string;
  data: RSISpectrumThreadContentData;
}

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

export interface RSISpectrumThreadContentElement
{
  id: number;
  type: RSISpectrumThreadContentElementType;
  data: RSISpectrumThreadContentElementData;
}

export interface RSISpectrumThreadContentElementData
{
  blocks: RSISpectrumThreadContentElementDataBlock[];
  entityMap: RSISpectrumThreadContentElementDataEntityMap[];
}

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

export interface RSISpectrumThreadContentElementDataEntityRange
{
  offset: number;
  length: number;
  key: number;
}

export interface RSISpectrumThreadContentElementDataInlineStyleRange
{
  offset: number;
  length: number;
  style: string;
}

export enum RSISpectrumThreadContentElementDataBlockType
{
  HeaderOne = 'header-one',
  Unstyled = 'unstyled',
  UnorderedListItem = 'unordered-list-item',
  Blockquote = 'blockquote',
}

export interface RSISpectrumThreadContentElementDataEntityMap
{
  type: string;
  mutability: string;
  data: RSISpectrumThreadContentElementDataEntityMapData | string;
}

export interface RSISpectrumThreadContentElementDataEntityMapData
{
  href: string;
}

export enum RSISpectrumThreadContentElementType
{
  Image = 'image',
  Text = 'text',
}

export interface RSISpectrumThreadContentLatestActivity
{
  time_created: number;
  member: RSISpectrumThreadContentLatestActivityMember;
  highlight_role_id: null;
}

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

export interface RSISpectrumThreadContentLatestActivityMemberMeta
{
  badges: RSISpectrumThreadContentLatestActivityMemberMetaBadge[];
}

export interface RSISpectrumThreadContentLatestActivityMemberMetaBadge
{
  name: string;
  icon: string;
}

export interface RSISpectrumThreadContentLatestActivityMemberRoles
{
  '1': string[];
}

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

export interface RSISpectrumThreadContentErasedByClassMeta
{
  badges: RSISpectrumThreadContentErasedByClassMetaBadge[];
}

export interface RSISpectrumThreadContentErasedByClassMetaBadge
{
  name: string;
  icon: string;
  url?: string;
}

export interface RSIPresence
{
  status: string;
  info: null;
  since: number;
}

export enum RSISpectrumThreadContentErasedByClassSignature
{
  TypicalDutch = 'TypicalDutch',
  Empty = '',
}

export interface RSISpectrumThreadContentReaction
{
  type: string;
  count: number;
  members: { [key: string]: string; };
}

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

export interface RSISpectrumThreadContentReplyReference
{
  id: string;
  label: string;
}

export interface RSISpectrumThreadContentReplyContentBlock
{
  id: number | string;
  type: RSISpectrumThreadContentElementType;
  data: RSISpectrumThreadContentReplyContentBlockData[] | RSISpectrumThreadContentElementData;
}

export interface RSISpectrumThreadContentReplyContentBlockData
{
  id: string;
  type: string;
  data: RSISpectrumThreadContentReplyContentBlockDataData;
}

export interface RSISpectrumThreadContentReplyContentBlockDataData
{
  url: string;
  image_width: string;
  image_height: string;
  sizes: RSISpectrumThreadContentReplyContentBlockDataDataSizes;
}

export interface RSISpectrumThreadContentReplyContentBlockDataDataSizes
{
  mini: RSISpectrumThreadContentReplyContentBlockDataDataSizesLarge;
  square: RSISpectrumThreadContentReplyContentBlockDataDataSizesLarge;
  small: RSISpectrumThreadContentReplyContentBlockDataDataSizesLarge;
  medium: RSISpectrumThreadContentReplyContentBlockDataDataSizesLarge;
  large: RSISpectrumThreadContentReplyContentBlockDataDataSizesLarge;
}

export interface RSISpectrumThreadContentReplyContentBlockDataDataSizesLarge
{
  url: string;
}

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

export interface RSISpectrumThreadContentDataVotes
{
  count: number;
  voted: number;
}
