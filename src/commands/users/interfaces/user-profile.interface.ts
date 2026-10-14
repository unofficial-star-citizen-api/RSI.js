import type { RSIResourceMeta } from '@/types/resource-meta.interface';

export interface RSIUserProfile
{
  meta: RSIResourceMeta;
  id: string | undefined;
  display: string | undefined;
  handle: string | undefined;
  badge: RSIUserProfileBadge | undefined;
  image: string | undefined;
  enlisted: string | undefined;
  location: RSIUserProfileLocation | undefined;
  fluency: string[];
  website: string | undefined;
  bio: RSIUserProfileBio;
}

export interface RSIUserProfileBadge
{
  name: string | undefined;
  image: string | undefined;
}

export interface RSIUserProfileLocation
{
  country: string | undefined;
  region: string | undefined;
}

export interface RSIUserProfileBio
{
  text: string | undefined;
  html: string | undefined;
}