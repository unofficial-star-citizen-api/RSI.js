import { BaseCommand } from '@interfaces';
import { Connector } from '@services';

interface TimeAllocation {
  startDate: string;
  endDate: string;
  uuid: string;
  partialTime: boolean;
  __typename: string;
}

interface ProgressTrackerTeam {
  title: string;
  description: string;
  uuid: string;
  abbreviation: string;
  startDate: string;
  endDate: string;
  numberOfDeliverables: number;
  slug: string;
  timeAllocations: TimeAllocation[];
  __typename: string;
}

interface DeliverableCard {
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

interface Project {
  title: string;
  logo: string;
  __typename: string;
}

interface ProgressTrackerDeliverable {
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
  card: DeliverableCard;
  projects: Project[];
  __typename: string;
  disciplines?: DisciplineData;
}

interface DisciplineData {
  title: string;
  color: string;
  uuid: string;
  numberOfMembers: number;
  timeAllocations: TimeAllocation[];
  __typename: string;
}

/**
 * ProgressTracker class for retrieving Star Citizen progress tracker information
 */
export class ProgressTracker extends BaseCommand<ProgressTrackerTeam[]> {
  private readonly urlProgressTracker = "https://robertsspaceindustries.com/graphql";
  private readonly dateMin: string;
  private readonly dateMax: string;
  private readonly limit: number;
  private readonly offset: number;
  private connector: Connector;

  /**
   * @param dateMin - The roadmap start date
   * @param dateMax - The roadmap end date
   */
  constructor(dateMin = "2020-01-01", dateMax = "2022-12-31") {
    super();
    this.dateMin = dateMin;
    this.dateMax = dateMax;
    this.limit = 20;
    this.offset = 0;
    this.connector = new Connector();
  }

  /**
   * Execute the command to retrieve progress tracker information
   */
  public async execute(): Promise<ProgressTrackerTeam[] | null> {
    return this.getTeams();
  }

  /**
   * Get teams from the progress tracker
   */
  private async getTeams(): Promise<ProgressTrackerTeam[] | null> {
    const data = {
      operationName: "teams",
      query: `query
        teams(
          $startDate: String!,
          $endDate: String!,
          $search: String,
          $teamSlug: String,
          $deliverableSlug: String,
          $projectSlugs: [String],
          $disciplineSlugs: [String],
          $sortBy: SortMethod,
          $offset: Int,
          $limit: Int
        ) {
          progressTracker {
            teams(
              startDate: $startDate
              endDate: $endDate
              search: $search
              teamSlug: $teamSlug
              deliverableSlug: $deliverableSlug
              projectSlugs: $projectSlugs
              disciplineSlugs: $disciplineSlugs
              sortBy: $sortBy
              offset: $offset
              limit: $limit) {
                totalCount
                metaData {
                  ...Team
                  timeAllocations {
                    ...TimeAllocation
                    __typename
                  }
                  __typename
                }
                __typename
              }
            __typename
          }
        }
        fragment Team on Team {
          title
          description
          uuid
          abbreviation
          startDate
          endDate
          numberOfDeliverables
          slug
          __typename
        }

        fragment TimeAllocation on TimeAllocation {
          startDate
          endDate
          uuid
          partialTime
          __typename
        }
      `,
      variables: {
        startDate: this.dateMin,
        endDate: this.dateMax,
        offset: this.offset,
        limit: this.limit
      }
    };

    const req = await this.connector.request<{
      data?: {
        progressTracker: {
          teams: {
            totalCount: number;
            metaData: ProgressTrackerTeam[];
          }
        }
      }
    }>(this.urlProgressTracker, data);

    if (req === null || req.status !== 200) {
      return null;
    }

    try {
      const resp = req.data;
      if (!resp.data) {
        return null;
      }

      return resp.data.progressTracker.teams.metaData;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}

/**
 * ProgressTrackerInfo class for retrieving detailed Star Citizen progress tracker information
 */
export class ProgressTrackerInfo extends BaseCommand<ProgressTrackerDeliverable[]> {
  private readonly urlProgressTracker = "https://robertsspaceindustries.com/graphql";
  private readonly teamSlug: string;
  private readonly dateMin: string;
  private readonly dateMax: string;
  private connector: Connector;

  /**
   * @param slug - The slug identifier to get
   * @param dateMin - The roadmap start date
   * @param dateMax - The roadmap end date
   */
  constructor(slug: string, dateMin = "2020-01-01", dateMax = "2022-12-31") {
    super();
    this.teamSlug = slug;
    this.dateMin = dateMin;
    this.dateMax = dateMax;
    this.connector = new Connector();
  }

  /**
   * Execute the command to retrieve detailed progress tracker information
   */
  public async execute(): Promise<ProgressTrackerDeliverable[] | null> {
    const deliverables = await this.getDeliverables(this.teamSlug);
    if (deliverables === null) {
      return null;
    }

    const disciplinesSlugs: string[] = deliverables.map(deliv => deliv.slug);
    const disciplines = await this.getDisciplines(this.teamSlug, disciplinesSlugs);

    if (disciplines) {
      for (let i = 0; i < deliverables.length; i++) {
        deliverables[i].disciplines = disciplines[i];
      }
    }

    return deliverables;
  }

  /**
   * Get deliverables from the progress tracker
   */
  private async getDeliverables(teamSlug: string): Promise<ProgressTrackerDeliverable[] | null> {
    const data = {
      operationName: "deliverables",
      query: `query
        deliverables(
          $startDate: String!,
          $endDate: String!,
          $search: String,
          $deliverableSlug: String,
          $teamSlug: String,
          $projectSlugs: [String],
          $categoryIds: [Int],
          $sortBy: SortMethod,
          $offset: Int,
          $limit: Int
        ) {
          progressTracker {
            deliverables(
              startDate: $startDate
              endDate: $endDate
              search: $search
              deliverableSlug: $deliverableSlug
              teamSlug: $teamSlug
              projectSlugs: $projectSlugs
              categoryIds: $categoryIds
              sortBy: $sortBy
              offset: $offset
              limit: $limit
            ) {
              totalCount
              metaData {
                ...Deliverable
                card {
                  ...Card
                  __typename
                }
                projects {
                  ...Project
                  __typename
                }
                __typename
              }
              __typename
            }
            __typename
          }
        }
        fragment Deliverable on Deliverable {
          uuid
          slug
          title
          description
          startDate
          endDate
          numberOfDisciplines
          numberOfTeams
          updateDate
          totalCount
          __typename
        }
        fragment Card on Card {
          id
          title
          description
          category
          release {
            id
            title
            __typename
          }
          board {
            id
            title
            __typename
          }
          updateDate
          thumbnail
          __typename
        }
        fragment Project on Project {
          title
          logo
          __typename
        }
      `,
      variables: {
        teamSlug,
        startDate: this.dateMin,
        endDate: this.dateMax,
      }
    };

    const req = await this.connector.request<{
      data?: {
        progressTracker: {
          deliverables: {
            metaData: ProgressTrackerDeliverable[];
          }
        }
      }
    }>(this.urlProgressTracker, data);

    if (req === null || req.status !== 200) {
      return null;
    }

    try {
      const resp = req.data;
      if (!resp.data) {
        return null;
      }

      return resp.data.progressTracker.deliverables.metaData;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  /**
   * Get disciplines from the progress tracker
   */
  private async getDisciplines(teamSlug: string, deliverySlugs: string[]): Promise<DisciplineData[] | null> {
    // Since we need to handle multiple queries, we'll use a different approach
    const results: DisciplineData[] = [];

    for (const delSlug of deliverySlugs) {
      const data = {
        operationName: "disciplines",
        query: `query
          disciplines($teamSlug: String! $deliverableSlug: String! $startDate: String! $endDate: String! ) {
            progressTracker {
              disciplines(teamSlug: $teamSlug deliverableSlug: $deliverableSlug startDate: $startDate endDate: $endDate ) {
                ...Discipline
                timeAllocations {
                  ...TimeAllocation
                  __typename
                }
                __typename
              }
              __typename
            }
          }
          fragment Discipline on Discipline {
            title
            color
            uuid
            numberOfMembers
            __typename
          }
          fragment TimeAllocation on TimeAllocation {
            startDate
            endDate
            uuid
            partialTime
            __typename
          }
        `,
        variables: {
          teamSlug,
          deliverableSlug: delSlug,
          startDate: this.dateMin,
          endDate: this.dateMax,
        }
      };

      const req = await this.connector.request<{
        data?: {
          progressTracker: {
            disciplines: DisciplineData[];
          }
        }
      }>(this.urlProgressTracker, data);

      if (req && req.status === 200 && req.data.data) {
        results.push(req.data.data.progressTracker.disciplines[0]);
      }
    }

    return results.length > 0 ? results : null;
  }
}
