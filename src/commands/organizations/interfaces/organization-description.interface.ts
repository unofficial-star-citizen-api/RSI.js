/**
 * Represents the detailed information of an organization
 */
export interface RSIOrganization
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
  focus: RSIOrganizationFocusArea;

  // Descriptive content
  headline: RSIOrganizationFormattedContent;
  history: RSIOrganizationFormattedContent;
  manifesto: RSIOrganizationFormattedContent;
  charter: RSIOrganizationFormattedContent;
}

/**
 * Represents the focus areas of an organization, including primary and secondary focuses
 */
export interface RSIOrganizationFocusArea
{
  primary: RSIOrganizationFocus;
  secondary: RSIOrganizationFocus;
}

/**
 * Represents a focus area with an image and name
 */
export interface RSIOrganizationFocus
{
  image: string | undefined;
  name: string | undefined;
}

/**
 * Represents content that has both HTML and plaintext versions
 */
export interface RSIOrganizationFormattedContent
{
  html: string | undefined;
  plaintext: string | undefined;
}
