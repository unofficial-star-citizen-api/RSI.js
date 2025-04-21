/**
 * Represents a focus area with an image and name
 */
export type RSIFocusArea = {
  image: string | undefined;
  name: string | undefined;
};

/**
 * Represents content that has both HTML and plaintext versions
 */
export type RSIFormattedContent = {
  html: string | undefined;
  plaintext: string | undefined;
};

/**
 * Represents the detailed information of an organization
 */
export type RSIOrganizationDetail = {
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
  focus: {
    primary: RSIFocusArea;
    secondary: RSIFocusArea;
  };

  // Descriptive content
  headline: RSIFormattedContent;
  history: RSIFormattedContent;
  manifesto: RSIFormattedContent;
  charter: RSIFormattedContent;
};
