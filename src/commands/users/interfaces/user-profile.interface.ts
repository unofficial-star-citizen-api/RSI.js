export interface RSIUserProfile
{
  page: RSIUserProfilePage;
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

export interface RSIUserProfilePage
{
  url: string | undefined;
  title: string | undefined;
}

export interface RSIUserProfileBadge
{
  name: string;
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