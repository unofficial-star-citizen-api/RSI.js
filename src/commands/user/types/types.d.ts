export type UserProfile = {
  page: {
    url: string | undefined;
    title: string | undefined;
  };
  id: string | undefined;
  display: string | undefined;
  handle: string | undefined;
  badge: string | undefined;
  badge_image: string | undefined;
  image: string | undefined;
  enlisted: string | undefined;
  location: {
    country: string | undefined;
    region: string | undefined;
  } | undefined;
  fluency: string[];
  website: string | undefined;
  bio: {
    text: string | undefined;
    html: string | undefined;
  };
};

export type UserOrganization = {
  organization: MainOrganization;
  affiliations: AffiliationOrganization[];
};

export type MainOrganization = {
  info: {
    url: string | undefined;
    sid: string | undefined;
    name: string | undefined;
    rank: string | undefined;
    stars: number | undefined;
    image: string | undefined;
    members: number | undefined;
  };
  characteristics: {
    archetype: string | undefined;
    primaryLanguage: string | undefined;
    primaryActivity: string | undefined;
    recruiting: boolean | undefined;
    sectorOfActivity: string | undefined;
    roleplay: boolean | undefined;
    commitment: string | undefined;
    exclusive: boolean | undefined;
  };
};

export type AffiliationOrganization = {
  sid: string | undefined;
  name: string | undefined;
  rank: string | undefined;
  stars: number | undefined;
  image: string | undefined;
  members: number | undefined;
}

