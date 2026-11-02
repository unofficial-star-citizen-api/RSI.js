/** @internal */
export interface RSIProgressTrackerDeliverableResponse
{
  data?: {
    progressTracker?: {
      deliverables?: {
        totalCount: number;
        metaData: RSIProgressTrackerDeliverableResponseItem[];
        __typename: string;
      };
      __typename: string;
    };
  };
  errors?: {
    message: string;
    locations: [
      {
        line: number;
        column: number;
      }
    ];
    path: string[];
    extensions: {
      details: Record<string, unknown>;
    };
    code: string;
    kind: string;
    category: string;
  }[];
}

interface RSIProgressTrackerDeliverableResponseItem extends Omit<RSIProgressTrackerDeliverable, 'startDate' | 'endDate' | 'updateDate' | 'card'>
{
  startDate: string;
  endDate: string;
  updateDate: string;
  card: RSIProgressTrackerDeliverableCardResponseItem | null;
}

interface RSIProgressTrackerDeliverableCardResponseItem extends Omit<RSIProgressTrackerDeliverableCard, 'updateDate'>
{
  updateDate: string;
}

/**
 * Roadmap card linked to a deliverable.
 *
 * @category Types/Progress trackers
 */
export interface RSIProgressTrackerDeliverableCard
{
  /** Card identifier */
  id: number;
  /** Card title */
  title: string;
  /** Card description */
  description: string;
  /** Card category */
  category: string;
  /** Release the card is scheduled in, for example `4.0`, or `null` */
  release: {
    id: number;
    title: string;
    __typename: string;
  } | null;
  /** Roadmap board of the card, or `null` */
  board: {
    id: number;
    title: string;
    __typename: string;
  } | null;
  /** Last update of the card */
  updateDate: Date;
  /** URL of the card thumbnail */
  thumbnail: string;
  /** GraphQL type name */
  __typename: string;
}

/**
 * Project a deliverable belongs to: Star Citizen or Squadron 42.
 *
 * @category Types/Progress trackers
 */
export interface RSIProgressTrackerDeliverableProject
{
  /** Project name, for example `Star Citizen` */
  title: string;
  /** URL of the project logo */
  logo: string;
  /** GraphQL type name */
  __typename: string;
}

/**
 * A deliverable on the progress tracker, returned by {@link ProgressTrackers.getDeliverables}.
 *
 * @category Types/Progress trackers
 */
export interface RSIProgressTrackerDeliverable
{
  /** Unique identifier */
  uuid: string;
  /** Slug */
  slug: string;
  /** Deliverable name */
  title: string;
  /** Deliverable description */
  description: string;
  /** Start of the work */
  startDate: Date;
  /** Planned end of the work */
  endDate: Date;
  /** Number of disciplines involved */
  numberOfDisciplines: number;
  /** Number of teams involved */
  numberOfTeams: number;
  /** Last update */
  updateDate: Date;
  /** Total count reported by RSI, or `null` */
  totalCount: number | null;
  /** Linked roadmap card, or `null` if the deliverable is not on the roadmap */
  card: RSIProgressTrackerDeliverableCard | null;
  /** Projects the deliverable belongs to */
  projects: RSIProgressTrackerDeliverableProject[];
  /** GraphQL type name */
  __typename: string;
}
