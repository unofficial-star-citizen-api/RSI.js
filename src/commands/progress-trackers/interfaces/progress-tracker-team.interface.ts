/**@internal */
export interface RSIProgressTrackerTeamResponse
{
  data?: {
    progressTracker: {
      teams: {
        totalCount: number;
        metaData: RSIProgressTrackerTeam[];
      };
    };
  };
}

export interface RSIProgressTrackerTeamAllocation
{
  startDate: string;
  endDate: string;
  uuid: string;
  partialTime: boolean;
  __typename: string;
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
  timeAllocations: RSIProgressTrackerTeamAllocation[];
  __typename: string;
}
