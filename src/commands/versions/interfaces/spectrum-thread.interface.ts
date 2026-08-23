/** @internal */
export interface RSISpectrumThreadResponse
{
  success: number;
  code: string;
  msg: string;
  data: RSISpectrumThreadData;
}

export interface RSISpectrumThreadData
{
  threads: RSISpectrumThreadDataThread[];
  threads_count: number;
  latest: number;
  latest_timestamp: string;
}

export interface RSISpectrumThreadDataThread
{
  id: string;
  time_created: number;
  time_modified: number;
  channel_id: string;
  type: RSISpectrumThreadDataThreadType;
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
  label: null;
  subscription_key: string;
  member: RSISpectrumThreadDataThreadMember;
  votes: RSISpectrumThreadDataThreadVotes;
  replies_count: number;
  views_count: number;
  highlight_role_id: string;
  latest_activity: RSISpectrumThreadDataThreadLatestActivity;
  aspect: RSISpectrumThreadDataThreadAspect;
  first_tracked_reply?: string;
}

export enum RSISpectrumThreadDataThreadAspect
{
  Teaser = 'teaser',
}

export interface RSISpectrumThreadDataThreadLatestActivity
{
  time_created: number;
  member: RSISpectrumThreadDataThreadLatestActivityMember;
  highlight_role_id: null | string;
}

export interface RSISpectrumThreadDataThreadLatestActivityMember
{
  id: string;
  displayname: string;
  nickname: string;
  avatar: null | string;
  signature: string;
  meta: RSISpectrumThreadMeta;
  isGM: boolean;
  spoken_languages: string[];
  roles: { [key: string]: string[]; };
}

export interface RSISpectrumThreadMeta
{
  badges: RSISpectrumThreadDataThreadLatestActivityMemberMetaBadge[];
}

export interface RSISpectrumThreadDataThreadLatestActivityMemberMetaBadge
{
  name: string;
  icon: string;
  url?: string;
}

export interface RSISpectrumThreadDataThreadMember
{
  id: string;
  displayname: string;
  nickname: string;
  avatar: string;
  signature: string;
  meta: RSISpectrumThreadMeta;
  isGM: boolean;
  spoken_languages: string[];
  presence: RSISpectrumThreadDataThreadMemberPresence;
  roles: { [key: string]: string[]; };
}

export interface RSISpectrumThreadDataThreadMemberPresence
{
  status: RSISpectrumThreadDataThreadMemberPresenceStatus;
  info: null;
  since: number;
}

export enum RSISpectrumThreadDataThreadMemberPresenceStatus
{
  Offline = 'offline',
  Online = 'online',
}

export enum RSISpectrumThreadDataThreadType
{
  Discussion = 'discussion',
}

export interface RSISpectrumThreadDataThreadVotes
{
  count: number;
  voted: number;
}
