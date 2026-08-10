export interface RSIUserOrganization
{
  organization: RSIMainOrganization;
  affiliations: RSIAffiliationOrganization[];
}

export interface RSIMainOrganization
{
  info: RSIMainOrganizationInfo;
  characteristics: RSIMainOrganizationCharacteristics;
}

export interface RSIMainOrganizationInfo
{
  url: string | undefined;
  sid: string | undefined;
  name: string | undefined;
  rank: string | undefined;
  stars: number | undefined;
  image: string | undefined;
  members: number | undefined;
}

export interface RSIMainOrganizationCharacteristics
{
  archetype: string | undefined;
  primaryLanguage: string | undefined;
  primaryActivity: string | undefined;
  recruiting: boolean | undefined;
  sectorOfActivity: string | undefined;
  roleplay: boolean | undefined;
  commitment: string | undefined;
  exclusive: boolean | undefined;
}

export interface RSIAffiliationOrganization
{
  sid: string | undefined;
  name: string | undefined;
  rank: string | undefined;
  stars: number | undefined;
  image: string | undefined;
  members: number | undefined;
}
