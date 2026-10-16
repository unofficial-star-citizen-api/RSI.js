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

interface RSIProgressTrackerDeliverableResponseItem extends Omit<RSIProgressTrackerDeliverable, 'startDate' | 'endDate'>
{
  startDate: string;
  endDate: string;
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
  startDate: Date;
  endDate: Date;
  numberOfDisciplines: number;
  numberOfTeams: number;
  updateDate: string;
  totalCount: number | null;
  card: RSIProgressTrackerDeliverableCard | null;
  projects: RSIProgressTrackerDeliverableProject[];
  __typename: string;
}
