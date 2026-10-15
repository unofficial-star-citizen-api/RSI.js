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
   * Get all teams from the progress tracker within the specified date range
   * @param dateMin - The roadmap start date
   * @param dateMax - The roadmap end date
   * @returns A list of progress tracker teams within the specified date range
   */
  public async getTeams(dateMin = '2020-01-01', dateMax?: string): Promise<RSIProgressTrackerTeam[]>
  {
    // if dateMax is not provided, set it to the current date + 2 years
    dateMax ??= new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0];

    return this.fetchTeams(dateMin, dateMax);
  }

  /**
   * Get a team from the progress tracker by slug
   */
  public async getTeamBySlug(teamSlug: string): Promise<RSIProgressTrackerTeam | undefined>
  {
    const teams = await this.fetchTeams('2020-01-01', '2022-12-31', teamSlug);
    return teams.find(team => team.slug === teamSlug);
  }

  private async fetchTeams(dateMin: string, dateMax: string, teamSlug?: string): Promise<RSIProgressTrackerTeam[]>
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
        ...(teamSlug === undefined ? {} : { teamSlug }),
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
