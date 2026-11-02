/** @internal */
export interface RSIProgressTrackerTeamResponse
{
  data?: {
    progressTracker?: {
      teams?: {
        totalCount: number;
        metaData: RSIProgressTrackerTeamResponseItem[];
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

interface RSIProgressTrackerTeamResponseItem extends Omit<RSIProgressTrackerTeam, 'startDate' | 'endDate' | 'timeAllocations'>
{
  startDate: string;
  endDate: string;
  timeAllocations: RSIProgressTrackerTeamAllocationResponseItem[] | null;
}

interface RSIProgressTrackerTeamAllocationResponseItem extends Omit<RSIProgressTrackerTeamAllocation, 'startDate' | 'endDate'>
{
  startDate: string;
  endDate: string;
}

/**
 * A period during which a team is allocated to a deliverable.
 *
 * @category Progress trackers
 */
export interface RSIProgressTrackerTeamAllocation
{
  /** Start of the allocation */
  startDate: Date;
  /** End of the allocation */
  endDate: Date;
  /** Unique identifier */
  uuid: string;
  /** Whether the team works on it part-time */
  partialTime: boolean;
  /** GraphQL type name */
  __typename: string;
}

/**
 * A development team on the progress tracker, returned by {@link ProgressTrackers.getTeams}.
 *
 * @category Progress trackers
 */
export interface RSIProgressTrackerTeam
{
  /** Team name, for example `Game Code (Persistent Universe)` */
  title: string;
  /** Team description */
  description: string;
  /** Unique identifier */
  uuid: string;
  /** Short name of the team */
  abbreviation: string;
  /** Start of the team's first allocation */
  startDate: Date;
  /** End of the team's last allocation */
  endDate: Date;
  /** Number of deliverables the team works on */
  numberOfDeliverables: number;
  /** Slug, used by {@link ProgressTrackers.getTeamBySlug} and {@link ProgressTrackers.getDeliverablesByTeamSlug} */
  slug: string;
  /** Periods the team is allocated, or `null` if RSI returns none */
  timeAllocations: RSIProgressTrackerTeamAllocation[] | null;
  /** GraphQL type name */
  __typename: string;
}
