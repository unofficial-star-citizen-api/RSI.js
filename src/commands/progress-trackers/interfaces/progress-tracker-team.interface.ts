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

export interface RSIProgressTrackerTeamAllocation
{
  startDate: Date;
  endDate: Date;
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
  startDate: Date;
  endDate: Date;
  numberOfDeliverables: number;
  slug: string;
  timeAllocations: RSIProgressTrackerTeamAllocation[] | null;
  __typename: string;
}
