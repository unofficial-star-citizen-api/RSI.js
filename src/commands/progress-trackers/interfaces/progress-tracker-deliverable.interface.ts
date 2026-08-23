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
  };
  board: {
    id: number;
    title: string;
  };
  updateDate: string;
  thumbnail: string;
}

export interface RSIProgressTrackerDeliverableProject
{
  title: string;
  logo: string;
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
  disciplines?: RSIProgressTrackerDeliverableDiscipline;
}

export interface RSIProgressTrackerDeliverableDiscipline
{
  title: string;
  color: string;
  uuid: string;
  numberOfMembers: number;
  timeAllocations: RSIProgressTrackerDeliverableTimeAllocation[];
}