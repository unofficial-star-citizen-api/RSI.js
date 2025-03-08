export type UserProfile = {
  page?: {
    url?: string;
    title?: string;
  };
  id?: string;
  display?: string;
  handle?: string;
  badge?: string;
  badge_image?: string;
  image?: string;
  enlisted?: string;
  location?: {
    country?: string;
    region?: string;
  };
  fluency?: string[];
  website?: string;
  bio?: string;
}
