export type SpectrumThreads = {
  success: number;
  code   : string;
  msg    : string;
  data   : Data;
}

export type Data = {
  threads         : Thread[];
  threads_count   : number;
  latest          : number;
  latest_timestamp: string;
}

export type Thread = {
  id                       : string;
  time_created             : number;
  time_modified            : number;
  channel_id               : string;
  type                     : Type;
  slug                     : string;
  subject                  : string;
  is_locked                : boolean;
  is_reply_nesting_disabled: boolean;
  is_pinned                : boolean;
  is_sinked                : boolean;
  is_erased                : boolean;
  erased_by                : null;
  tracked_post_role_id     : string;
  content_reply_id         : string;
  annotation_plaintext     : null;
  label                    : null;
  subscription_key         : string;
  member                   : ThreadMember;
  votes                    : Votes;
  replies_count            : number;
  views_count              : number;
  highlight_role_id        : string;
  latest_activity          : LatestActivity;
  aspect                   : Aspect;
  first_tracked_reply?     : string;
}

export enum Aspect {
  Teaser = 'teaser',
}

export type LatestActivity = {
  time_created     : number;
  member           : LatestActivityMember;
  highlight_role_id: null | string;
}

export type LatestActivityMember = {
  id              : string;
  displayname     : string;
  nickname        : string;
  avatar          : null | string;
  signature       : string;
  meta            : Meta;
  isGM            : boolean;
  spoken_languages: string[];
  roles           : { [key: string]: string[] };
}

export type Meta = {
  badges: Badge[];
}

export type Badge = {
  name: string;
  icon: string;
  url?: string;
}

export type ThreadMember = {
  id              : string;
  displayname     : string;
  nickname        : string;
  avatar          : string;
  signature       : string;
  meta            : Meta;
  isGM            : boolean;
  spoken_languages: string[];
  presence        : Presence;
  roles           : { [key: string]: string[] };
}

export type Presence = {
  status: 'offline' | 'online';
  info  : null;
  since : number;
}

export enum Type {
  Discussion = 'discussion',
}

export type Votes = {
  count: number;
  voted: number;
}
