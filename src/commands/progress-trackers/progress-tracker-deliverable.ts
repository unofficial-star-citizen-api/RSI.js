import { HttpClient } from '@/http-client';
import
{
  RSIProgressTrackerDeliverable,
  RSIProgressTrackerDeliverableDiscipline,
  RSIProgressTrackerDeliverableDisciplinesResponse,
  RSIProgressTrackerDeliverableResponse
} from './interfaces';

/**
 * ProgressTrackerInfo class for retrieving detailed Star Citizen progress tracker information
 */
export class ProgressTrackerDeliverable
{
  private readonly urlProgressTracker = 'https://robertsspaceindustries.com/graphql';
  private readonly httpClient: HttpClient;

  /**
   * @param slug - The slug identifier to get
   * @param dateMin - The roadmap start date
   * @param dateMax - The roadmap end date
   */
  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  /**
   * Execute the command to retrieve detailed progress tracker information
   */
  public async getTeamDeliverableInfo(teamSlug: string, dateMin = '2020-01-01', dateMax = '2022-12-31'): Promise<RSIProgressTrackerDeliverable[] | null>
  {
    const deliverables = await this.getDeliverables(teamSlug, dateMin, dateMax);
    if (deliverables === null)
    {
      throw new Error(`Failed to retrieve deliverables for team ${teamSlug}`);
    }

    const disciplinesSlugs: string[] = deliverables.map(deliv => deliv.slug);
    const disciplines = await this.getDisciplines(teamSlug, disciplinesSlugs, dateMin, dateMax);

    if (disciplines)
    {
      for (let i = 0; i < deliverables.length; i++)
      {
        deliverables[i].disciplines = disciplines[i];
      }
    }

    return deliverables;
  }

  /**
   * Get deliverables from the progress tracker
   */
  private async getDeliverables(teamSlug: string, dateMin = '2020-01-01', dateMax = '2022-12-31'): Promise<RSIProgressTrackerDeliverable[] | null>
  {
    const data = {
      operationName: 'deliverables',
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
                }
                projects {
                  ...Project
                }
              }
            }
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
        }
        fragment Card on Card {
          id
          title
          description
          category
          release {
            id
            title
          }
          board {
            id
            title
          }
          updateDate
          thumbnail
        }
        fragment Project on Project {
          title
          logo
        }
      `,
      variables: {
        teamSlug,
        startDate: dateMin,
        endDate: dateMax,
      }
    };

    const req = await this.httpClient.post<RSIProgressTrackerDeliverableResponse>(this.urlProgressTracker, data);

    if (req === null || req.status !== 200)
    {
      return null;
    }

    try
    {
      const resp = req.data;
      if (!resp.data)
      {
        return null;
      }

      return resp.data.progressTracker.deliverables.metaData;
    } catch (e)
    {
      console.error(e);
      return null;
    }
  }

  /**
   * Get disciplines from the progress tracker
   */
  private async getDisciplines(teamSlug: string, deliverySlugs: string[], dateMin = '2020-01-01', dateMax = '2022-12-31'): Promise<RSIProgressTrackerDeliverableDiscipline[] | null>
  {
    // Since we need to handle multiple queries, we'll use a different approach
    const results: RSIProgressTrackerDeliverableDiscipline[] = [];

    for (const delSlug of deliverySlugs)
    {
      const data = {
        operationName: 'disciplines',
        query: `query
          disciplines($teamSlug: String! $deliverableSlug: String! $startDate: String! $endDate: String! ) {
            progressTracker {
              disciplines(teamSlug: $teamSlug deliverableSlug: $deliverableSlug startDate: $startDate endDate: $endDate ) {
                ...Discipline
                timeAllocations {
                  ...TimeAllocation
                }
              }
            }
          }
          fragment Discipline on Discipline {
            title
            color
            uuid
            numberOfMembers
          }
          fragment TimeAllocation on TimeAllocation {
            startDate
            endDate
            uuid
            partialTime
          }
        `,
        variables: {
          teamSlug,
          deliverableSlug: delSlug,
          startDate: dateMin,
          endDate: dateMax,
        }
      };

      const req = await this.httpClient.post<RSIProgressTrackerDeliverableDisciplinesResponse>(this.urlProgressTracker, data);

      if (req && req.status === 200 && req.data.data)
      {
        results.push(req.data.data.progressTracker.disciplines[0]);
      }
    }

    return results.length > 0 ? results : null;
  }
}
