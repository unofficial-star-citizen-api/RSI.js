import { HttpClient } from '@/http-client';
import { RSIProgressTrackerTeam, RSIProgressTrackerTeamResponse } from './interfaces';

/**
 * ProgressTracker class for retrieving Star Citizen progress tracker information
 */
export class ProgressTrackerTeam
{
  private readonly urlProgressTracker = 'https://robertsspaceindustries.com/graphql';
  private readonly limit: number = 20;
  private readonly offset: number = 0;
  private readonly httpClient: HttpClient;

  /**
   * @param dateMin - The roadmap start date
   * @param dateMax - The roadmap end date
   */
  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  /**
   * Get teams from the progress tracker
   */
  public async getTeamsInRange(dateMin = '2020-01-01', dateMax = '2022-12-31'): Promise<RSIProgressTrackerTeam[]>
  {
    const data = {
      operationName: 'teams',
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
        startDate: dateMin,
        endDate: dateMax,
        offset: this.offset,
        limit: this.limit
      }
    };

    const req = await this.httpClient.post<RSIProgressTrackerTeamResponse>(this.urlProgressTracker, data);

    if (req === null || req.status !== 200)
    {
      throw new Error(`Failed to retrieve progress tracker teams. Status code: ${req?.status}`);
    }

    try
    {
      const resp = req.data;
      if (!resp.data)
      {
        throw new Error('Failed to retrieve progress tracker teams. API returned no data.');
      }

      return resp.data.progressTracker.teams.metaData;
    } catch (e)
    {
      console.error(e);
      throw e instanceof Error ? e : new Error(`Unexpected error: ${e}`);
    }
  }
}
