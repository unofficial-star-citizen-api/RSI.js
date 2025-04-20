export interface SpectrumThreadContent
{
  success: number;
  code: string;
  msg: string;
  data: SpectrumThreadContentData;
}

export interface SpectrumThreadContentData
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
  content_blocks: DatumElement[];
  highlight_role_id: string;
  community_id: string;
  member: ErasedByClass;
  replies_count: number;
  views_count: number;
  latest: number;
  latest_activity: LatestActivity;
  votes: Votes;
  reactions: Reaction[];
  tracked_replies_references: unknown[];
  children_replies_references: unknown[];
  notification_subscription: null;
  aspect: string;
  nested_replies_ids: string[];
  replies: DataReply[];
}

export interface DatumElement
{
  id: number;
  type: DatumType;
  data: ContentBlockDataClass;
}

export interface ContentBlockDataClass
{
  blocks: Block[];
  entityMap: EntityMap[];
}

export interface Block
{
  key: string;
  text: string;
  type: BlockType;
  depth: number;
  inlineStyleRanges: InlineStyleRange[];
  entityRanges: EntityRange[];
  data: unknown[];
}

export interface EntityRange
{
  offset: number;
  length: number;
  key: number;
}

export interface InlineStyleRange
{
  offset: number;
  length: number;
  style: string;
}

export type BlockType = 'header-one' | 'unstyled' | 'unordered-list-item' | 'blockquote';

export interface EntityMap
{
  type: string;
  mutability: string;
  data: PurpleData | string;
}

export interface PurpleData
{
  href: string;
}

export type DatumType = 'image' | 'text';

export interface LatestActivity
{
  time_created: number;
  member: LatestActivityMember;
  highlight_role_id: null;
}

export interface LatestActivityMember
{
  id: string;
  displayname: string;
  nickname: string;
  avatar: null | string;
  signature: string;
  meta: PurpleMeta;
  isGM: boolean;
  spoken_languages: string[];
  roles?: Roles;
}

export interface PurpleMeta
{
  badges: PurpleBadge[];
}

export interface PurpleBadge
{
  name: string;
  icon: string;
}

export interface Roles
{
  '1': string[];
}

export interface ErasedByClass
{
  id: string;
  displayname: string;
  nickname: string;
  avatar: null | string;
  signature: Signature;
  meta: ErasedByMeta;
  isGM: boolean;
  spoken_languages: string[];
  presence?: Presence;
  roles?: { [key: string]: string[]; };
}

export interface ErasedByMeta
{
  badges: FluffyBadge[];
}

export interface FluffyBadge
{
  name: string;
  icon: string;
  url?: string;
}

export interface Presence
{
  status: string;
  info: null;
  since: number;
}

export type Signature = '' | 'TypicalDutch';

export interface Reaction
{
  type: string;
  count: number;
  members: { [key: string]: string; };
}

export interface DataReply
{
  id: string;
  time_created: number;
  time_modified: number;
  thread_id: string;
  content_blocks: PurpleContentBlock[];
  is_erased: boolean;
  erased_by: null;
  annotation_plaintext: null;
  member: PurpleMember;
  votes: Votes;
  reactions: Reaction[];
  parent_reply_reference: null;
  children_replies_references: Reference[];
  tracked_replies_references: unknown[];
  read: boolean;
  replies_count: number;
  replies: PurpleReply[];
}

export interface Reference
{
  id: string;
  label: string;
}

export interface PurpleContentBlock
{
  id: number | string;
  type: DatumType;
  data: PurpleDatum[] | ContentBlockDataClass;
}

export interface PurpleDatum
{
  id: string;
  type: string;
  data: FluffyData;
}

export interface FluffyData
{
  url: string;
  image_width: string;
  image_height: string;
  sizes: PurpleSizes;
}

export interface PurpleSizes
{
  mini: PurpleLarge;
  square: PurpleLarge;
  small: PurpleLarge;
  medium: PurpleLarge;
  large: PurpleLarge;
}

export interface PurpleLarge
{
  url: string;
}

export interface PurpleMember
{
  id: string;
  displayname: string;
  nickname: string;
  avatar: null | string;
  signature: string;
  meta: ErasedByMeta;
  isGM: boolean;
  spoken_languages: string[];
  roles: { [key: string]: string[]; };
}

export interface PurpleReply
{
  id: string;
  time_created: number;
  time_modified: number;
  thread_id: string;
  content_blocks: FluffyContentBlock[];
  is_erased: boolean;
  erased_by: null;
  annotation_plaintext: null;
  member: FluffyMember;
  votes: Votes;
  reactions: unknown[];
  parent_reply_reference: Reference;
  children_replies_references: Reference[];
  tracked_replies_references: unknown[];
  read: boolean;
  replies_count: number;
  replies: FluffyReply[];
}

export interface FluffyContentBlock
{
  id: number | string;
  type: PurpleType;
  data: DatumElement[] | ContentBlockDataClass;
  reply_id?: string;
  member?: LatestActivityMember;
}

export type PurpleType = 'text' | 'quote';

export interface FluffyMember
{
  id: string;
  displayname: string;
  nickname: string;
  avatar: null | string;
  signature: string;
  meta: ErasedByMeta;
  isGM: boolean;
  spoken_languages: string[];
  roles: { [key: string]: string[]; };
}

export interface FluffyReply
{
  id: string;
  time_created: number;
  time_modified: number;
  thread_id: string;
  content_blocks: FluffyContentBlock[];
  is_erased: boolean;
  erased_by: null;
  annotation_plaintext: null;
  member: PurpleMember;
  votes: Votes;
  reactions: unknown[];
  parent_reply_reference: Reference;
  children_replies_references: Reference[];
  tracked_replies_references: unknown[];
  read: boolean;
  replies_count: number;
  replies: TentacledReply[];
}

export interface TentacledReply
{
  id: string;
  time_created: number;
  time_modified: number;
  thread_id: string;
  content_blocks: TentacledContentBlock[];
  is_erased: boolean;
  erased_by: ErasedByClass | null;
  annotation_plaintext: null;
  member?: ErasedByClass;
  votes?: Votes;
  reactions?: unknown[];
  parent_reply_reference: Reference;
  children_replies_references: Reference[];
  tracked_replies_references: unknown[];
  read: boolean;
  replies_count: number;
  replies: StickyReply[];
}

export interface TentacledContentBlock
{
  id: number | string;
  type: DatumType;
  data: FluffyDatum[] | ContentBlockDataClass;
}

export interface FluffyDatum
{
  id: string;
  slug: string;
  type: string;
  data: TentacledData;
}

export interface TentacledData
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
  sizes: FluffySizes;
}

export interface FluffySizes
{
  mini: FluffyLarge;
  square: FluffyLarge;
  small: FluffyLarge;
  medium: FluffyLarge;
  large: FluffyLarge;
}

export interface FluffyLarge
{
  url: string;
  image_width: number;
  image_height: number;
}

export interface StickyReply
{
  id: string;
  time_created: number;
  time_modified: number;
  thread_id: string;
  content_blocks: DatumElement[];
  is_erased: boolean;
  erased_by: null;
  annotation_plaintext: null;
  member: ErasedByClass;
  votes: Votes;
  reactions: unknown[];
  parent_reply_reference: Reference;
  children_replies_references: unknown[];
  tracked_replies_references: unknown[];
  read: boolean;
  replies_count: number;
  replies: unknown[];
}

export interface Votes
{
  count: number;
  voted: number;
}
