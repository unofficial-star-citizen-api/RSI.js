/**
 * Represents a focus area with an image and name
 */
export type FocusArea = {
  image: string | undefined;
  name: string | undefined;
};

/**
 * Represents content that has both HTML and plaintext versions
 */
export type FormattedContent = {
  html: string | undefined;
  plaintext: string | undefined;
};

/**
 * Represents the detailed information of an organization
 */
export type OrganizationDetail = {
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
    primary: FocusArea;
    secondary: FocusArea;
  };

  // Descriptive content
  headline: FormattedContent;
  history: FormattedContent;
  manifesto: FormattedContent;
  charter: FormattedContent;
};
