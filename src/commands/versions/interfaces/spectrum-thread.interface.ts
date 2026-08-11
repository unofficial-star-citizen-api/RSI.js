/** @internal */
export interface SpectrumThreadResponse
{
  success: number;
  code: string;
  msg: string;
  data: SpectrumThreadData;
}

export interface SpectrumThreadData
{
  threads: SpectrumThreadDataThread[];
  threads_count: number;
  latest: number;
  latest_timestamp: string;
}

export interface SpectrumThreadDataThread
{
  id: string;
  time_created: number;
  time_modified: number;
  channel_id: string;
  type: SpectrumThreadDataThreadType;
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
  member: SpectrumThreadDataThreadMember;
  votes: SpectrumThreadDataThreadVotes;
  replies_count: number;
  views_count: number;
  highlight_role_id: string;
  latest_activity: SpectrumThreadDataThreadLatestActivity;
  aspect: SpectrumThreadDataThreadAspect;
  first_tracked_reply?: string;
}

export enum SpectrumThreadDataThreadAspect
{
  Teaser = 'teaser',
}

export interface SpectrumThreadDataThreadLatestActivity
{
  time_created: number;
  member: SpectrumThreadDataThreadLatestActivityMember;
  highlight_role_id: null | string;
}

export interface SpectrumThreadDataThreadLatestActivityMember
{
  id: string;
  displayname: string;
  nickname: string;
  avatar: null | string;
  signature: string;
  meta: SpectrumThreadMeta;
  isGM: boolean;
  spoken_languages: string[];
  roles: { [key: string]: string[]; };
}

export interface SpectrumThreadMeta
{
  badges: SpectrumThreadDataThreadLatestActivityMemberMetaBadge[];
}

export interface SpectrumThreadDataThreadLatestActivityMemberMetaBadge
{
  name: string;
  icon: string;
  url?: string;
}

export interface SpectrumThreadDataThreadMember
{
  id: string;
  displayname: string;
  nickname: string;
  avatar: string;
  signature: string;
  meta: SpectrumThreadMeta;
  isGM: boolean;
  spoken_languages: string[];
  presence: SpectrumThreadDataThreadMemberPresence;
  roles: { [key: string]: string[]; };
}

export interface SpectrumThreadDataThreadMemberPresence
{
  status: SpectrumThreadDataThreadMemberPresenceStatus;
  info: null;
  since: number;
}

export enum SpectrumThreadDataThreadMemberPresenceStatus
{
  Offline = 'offline',
  Online = 'online',
}

export enum SpectrumThreadDataThreadType
{
  Discussion = 'discussion',
}

export interface SpectrumThreadDataThreadVotes
{
  count: number;
  voted: number;
}
