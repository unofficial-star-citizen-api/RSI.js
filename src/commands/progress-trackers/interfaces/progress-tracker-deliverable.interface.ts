/** @internal */
export interface RSIProgressTrackerDeliverableResponse
{
  data?: {
    progressTracker?: {
      deliverables?: {
        totalCount: number;
        metaData: RSIProgressTrackerDeliverable[];
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

export interface RSIProgressTrackerDeliverableCard
{
  id: number;
  title: string;
  description: string;
  category: string;
  release: {
    id: number;
    title: string;
    __typename: string;
  } | null;
  board: {
    id: number;
    title: string;
    __typename: string;
  } | null;
  updateDate: string;
  thumbnail: string;
  __typename: string;
}

export interface RSIProgressTrackerDeliverableProject
{
  title: string;
  logo: string;
  __typename: string;
}

export interface RSIProgressTrackerDeliverable
{
  uuid: string;
  slug: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  numberOfDisciplines: number;
  numberOfTeams: number;
  updateDate: string;
  totalCount: number | null;
  card: RSIProgressTrackerDeliverableCard | null;
  projects: RSIProgressTrackerDeliverableProject[];
  __typename: string;
}
