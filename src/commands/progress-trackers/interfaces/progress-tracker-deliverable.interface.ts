/** @internal */
export interface RSIProgressTrackerDeliverableResponse
{
  data?: {
    progressTracker: {
      deliverables: {
        metaData: RSIProgressTrackerDeliverable[];
      };
    };
  };
}

/** @internal */
export interface RSIProgressTrackerDeliverableDisciplinesResponse
{
  data?: {
    progressTracker: {
      disciplines: RSIProgressTrackerDeliverableDiscipline[];
    };
  };
}

export interface RSIProgressTrackerDeliverableTimeAllocation
{
  startDate: string;
  endDate: string;
  uuid: string;
  partialTime: boolean;
  __typename: string;
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
  };
  board: {
    id: number;
    title: string;
    __typename: string;
  };
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
  totalCount: number;
  card: RSIProgressTrackerDeliverableCard;
  projects: RSIProgressTrackerDeliverableProject[];
  __typename: string;
  disciplines?: RSIProgressTrackerDeliverableDiscipline;
}

export interface RSIProgressTrackerDeliverableDiscipline
{
  title: string;
  color: string;
  uuid: string;
  numberOfMembers: number;
  timeAllocations: RSIProgressTrackerDeliverableTimeAllocation[];
  __typename: string;
}