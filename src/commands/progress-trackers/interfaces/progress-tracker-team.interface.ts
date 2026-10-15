/** @internal */
export interface RSIProgressTrackerTeamResponse
{
  data?: {
    progressTracker?: {
      teams?: {
        totalCount: number;
        metaData: RSIProgressTrackerTeam[];
        __typename: 'AggregatedTeams';
      };
      __typename: 'ProgressTracker';
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

export interface RSIProgressTrackerTeamAllocation
{
  startDate: string;
  endDate: string;
  uuid: string;
  partialTime: boolean;
  __typename: 'TimeAllocation';
}

export interface RSIProgressTrackerTeam
{
  title: string;
  description: string;
  uuid: string;
  abbreviation: string;
  startDate: string;
  endDate: string;
  numberOfDeliverables: number;
  slug: string;
  timeAllocations: RSIProgressTrackerTeamAllocation[] | null;
  __typename: 'Team';
}
