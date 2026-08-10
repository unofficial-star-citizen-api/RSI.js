/**
 * Represents the detailed information of an organization
 */
export interface RSIOrganizationGet
{
  // Basic identification
  sid: string;
  url: string;
  name: string | undefined;

  // Visual elements
  logo: string | undefined;
  banner: string | undefined;

  // Membership information
  membersCount: number | undefined;

  // Organization focus areas
  focus: RSIOrganizationFocus;

  // Descriptive content
  headline: RSIOrganizationGetFormattedContent;
  history: RSIOrganizationGetFormattedContent;
  manifesto: RSIOrganizationGetFormattedContent;
  charter: RSIOrganizationGetFormattedContent;
}

/**
 * Represents the focus areas of an organization, including primary and secondary focuses
 */
export interface RSIOrganizationFocus
{
  primary: RSIOrganizationGetFocus;
  secondary: RSIOrganizationGetFocus;
}

/**
 * Represents a focus area with an image and name
 */
export interface RSIOrganizationGetFocus
{
  image: string | undefined;
  name: string | undefined;
}

/**
 * Represents content that has both HTML and plaintext versions
 */
export interface RSIOrganizationGetFormattedContent
{
  html: string | undefined;
  plaintext: string | undefined;
}
