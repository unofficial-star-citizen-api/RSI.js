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
  content_blocks: RSIDatumElement[];
  highlight_role_id: string;
  community_id: string;
  member: RSIErasedByClass;
  replies_count: number;
  views_count: number;
  latest: number;
  latest_activity: RSILatestActivity;
  votes: RSIVotes;
  reactions: RSIReaction[];
  tracked_replies_references: unknown[];
  children_replies_references: unknown[];
  notification_subscription: null;
  aspect: string;
  nested_replies_ids: string[];
  replies: RSIDataReply[];
}

export interface RSIDatumElement
{
  id: number;
  type: RSIDatumType;
  data: RSIContentBlockDataClass;
}

export interface RSIContentBlockDataClass
{
  blocks: RSIBlock[];
  entityMap: RSIEntityMap[];
}

export interface RSIBlock
{
  key: string;
  text: string;
  type: RSIBlockType;
  depth: number;
  inlineStyleRanges: RSIInlineStyleRange[];
  entityRanges: RSIEntityRange[];
  data: unknown[];
}

export interface RSIEntityRange
{
  offset: number;
  length: number;
  key: number;
}

export interface RSIInlineStyleRange
{
  offset: number;
  length: number;
  style: string;
}

export type RSIBlockType = 'header-one' | 'unstyled' | 'unordered-list-item' | 'blockquote';

export interface RSIEntityMap
{
  type: string;
  mutability: string;
  data: RSIPurpleData | string;
}

export interface RSIPurpleData
{
  href: string;
}

export type RSIDatumType = 'image' | 'text';

export interface RSILatestActivity
{
  time_created: number;
  member: RSILatestActivityMember;
  highlight_role_id: null;
}

export interface RSILatestActivityMember
{
  id: string;
  displayname: string;
  nickname: string;
  avatar: null | string;
  signature: string;
  meta: RSIPurpleMeta;
  isGM: boolean;
  spoken_languages: string[];
  roles?: RSIRoles;
}

export interface RSIPurpleMeta
{
  badges: RSIPurpleBadge[];
}

export interface RSIPurpleBadge
{
  name: string;
  icon: string;
}

export interface RSIRoles
{
  '1': string[];
}

export interface RSIErasedByClass
{
  id: string;
  displayname: string;
  nickname: string;
  avatar: null | string;
  signature: RSISignature;
  meta: RSIErasedByMeta;
  isGM: boolean;
  spoken_languages: string[];
  presence?: RSIPresence;
  roles?: { [key: string]: string[]; };
}

export interface RSIErasedByMeta
{
  badges: RSIFluffyBadge[];
}

export interface RSIFluffyBadge
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

export type RSISignature = '' | 'TypicalDutch';

export interface RSIReaction
{
  type: string;
  count: number;
  members: { [key: string]: string; };
}

export interface RSIDataReply
{
  id: string;
  time_created: number;
  time_modified: number;
  thread_id: string;
  content_blocks: RSIPurpleContentBlock[];
  is_erased: boolean;
  erased_by: null;
  annotation_plaintext: null;
  member: RSIPurpleMember;
  votes: RSIVotes;
  reactions: RSIReaction[];
  parent_reply_reference: null;
  children_replies_references: RSIReference[];
  tracked_replies_references: unknown[];
  read: boolean;
  replies_count: number;
  replies: RSIPurpleReply[];
}

export interface RSIReference
{
  id: string;
  label: string;
}

export interface RSIPurpleContentBlock
{
  id: number | string;
  type: RSIDatumType;
  data: RSIPurpleDatum[] | RSIContentBlockDataClass;
}

export interface RSIPurpleDatum
{
  id: string;
  type: string;
  data: RSIFluffyData;
}

export interface RSIFluffyData
{
  url: string;
  image_width: string;
  image_height: string;
  sizes: RSIPurpleSizes;
}

export interface RSIPurpleSizes
{
  mini: RSIPurpleLarge;
  square: RSIPurpleLarge;
  small: RSIPurpleLarge;
  medium: RSIPurpleLarge;
  large: RSIPurpleLarge;
}

export interface RSIPurpleLarge
{
  url: string;
}

export interface RSIPurpleMember
{
  id: string;
  displayname: string;
  nickname: string;
  avatar: null | string;
  signature: string;
  meta: RSIErasedByMeta;
  isGM: boolean;
  spoken_languages: string[];
  roles: { [key: string]: string[]; };
}

export interface RSIPurpleReply
{
  id: string;
  time_created: number;
  time_modified: number;
  thread_id: string;
  content_blocks: RSIFluffyContentBlock[];
  is_erased: boolean;
  erased_by: null;
  annotation_plaintext: null;
  member: RSIFluffyMember;
  votes: RSIVotes;
  reactions: unknown[];
  parent_reply_reference: RSIReference;
  children_replies_references: RSIReference[];
  tracked_replies_references: unknown[];
  read: boolean;
  replies_count: number;
  replies: RSIFluffyReply[];
}

export interface RSIFluffyContentBlock
{
  id: number | string;
  type: RSIPurpleType;
  data: RSIDatumElement[] | RSIContentBlockDataClass;
  reply_id?: string;
  member?: RSILatestActivityMember;
}

export type RSIPurpleType = 'text' | 'quote';

export interface RSIFluffyMember
{
  id: string;
  displayname: string;
  nickname: string;
  avatar: null | string;
  signature: string;
  meta: RSIErasedByMeta;
  isGM: boolean;
  spoken_languages: string[];
  roles: { [key: string]: string[]; };
}

export interface RSIFluffyReply
{
  id: string;
  time_created: number;
  time_modified: number;
  thread_id: string;
  content_blocks: RSIFluffyContentBlock[];
  is_erased: boolean;
  erased_by: null;
  annotation_plaintext: null;
  member: RSIPurpleMember;
  votes: RSIVotes;
  reactions: unknown[];
  parent_reply_reference: RSIReference;
  children_replies_references: RSIReference[];
  tracked_replies_references: unknown[];
  read: boolean;
  replies_count: number;
  replies: RSITentacledReply[];
}

export interface RSITentacledReply
{
  id: string;
  time_created: number;
  time_modified: number;
  thread_id: string;
  content_blocks: RSITentacledContentBlock[];
  is_erased: boolean;
  erased_by: RSIErasedByClass | null;
  annotation_plaintext: null;
  member?: RSIErasedByClass;
  votes?: RSIVotes;
  reactions?: unknown[];
  parent_reply_reference: RSIReference;
  children_replies_references: RSIReference[];
  tracked_replies_references: unknown[];
  read: boolean;
  replies_count: number;
  replies: RSIStickyReply[];
}

export interface RSITentacledContentBlock
{
  id: number | string;
  type: RSIDatumType;
  data: RSIFluffyDatum[] | RSIContentBlockDataClass;
}

export interface RSIFluffyDatum
{
  id: string;
  slug: string;
  type: string;
  data: RSITentacledData;
}

export interface RSITentacledData
{
  embed_type: string;
  url: string;
  provider_name: string;
  title: string;
  description: null;
  image: string;
  image_width: number;
  image_height: number;
  provider_icon: string;
  time_fetched: number;
  sizes: RSIFluffySizes;
}

export interface RSIFluffySizes
{
  mini: RSIFluffyLarge;
  square: RSIFluffyLarge;
  small: RSIFluffyLarge;
  medium: RSIFluffyLarge;
  large: RSIFluffyLarge;
}

export interface RSIFluffyLarge
{
  url: string;
  image_width: number;
  image_height: number;
}

export interface RSIStickyReply
{
  id: string;
  time_created: number;
  time_modified: number;
  thread_id: string;
  content_blocks: RSIDatumElement[];
  is_erased: boolean;
  erased_by: null;
  annotation_plaintext: null;
  member: RSIErasedByClass;
  votes: RSIVotes;
  reactions: unknown[];
  parent_reply_reference: RSIReference;
  children_replies_references: unknown[];
  tracked_replies_references: unknown[];
  read: boolean;
  replies_count: number;
  replies: unknown[];
}

export interface RSIVotes
{
  count: number;
  voted: number;
}
