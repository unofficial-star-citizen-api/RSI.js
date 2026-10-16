import { HttpClient } from '@/http-client';
import { RSIError } from '@/errors';
import { RSIProgressTrackerTeam, RSIProgressTrackerTeamResponse } from './interfaces';

/**
 * ProgressTracker class for retrieving Star Citizen progress tracker information
 */
export class ProgressTrackerTeam
{
  private readonly urlProgressTracker = 'https://robertsspaceindustries.com/graphql';
  private readonly limit: number = 20;
  private readonly httpClient: HttpClient;

  /**
   * @param httpClient - The HTTP client instance to use for API requests
   */
  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  /**
   * Get all teams from the progress tracker within the specified date range
   * @returns A list of progress tracker teams within the specified date range
   */
  public async getTeams(): Promise<RSIProgressTrackerTeam[]>
  {
    return this.fetchTeams();
  }

  /**
   * Get a team from the progress tracker by slug
   * @param teamSlug - The slug identifier of the team to retrieve
   * @returns A promise that resolves to the progress tracker team with the specified slug, or undefined if not found
   */
  public async getTeamBySlug(teamSlug: string): Promise<RSIProgressTrackerTeam | undefined>
  {
    const teams = await this.fetchTeams(teamSlug);
    return teams.find(team => team.slug === teamSlug);
  }

  private async fetchTeams(teamSlug?: string): Promise<RSIProgressTrackerTeam[]>
  {
    const dateMax = new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0];
    const data = {
      operationName: 'teams',
      query: `query teams(
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
        startDate: '2020-01-01',
        endDate: dateMax,
        ...(teamSlug === undefined ? {} : { teamSlug }),
        offset: 0,
        limit: this.limit
      }
    };

    const teams: RSIProgressTrackerTeam[] = [];
    let offset = 0;
    let totalCount: number;
    do
    {
      const response = await this.httpClient.post<RSIProgressTrackerTeamResponse>(
        this.urlProgressTracker,
        { ...data, variables: { ...data.variables, offset } }
      );

      if (response === null || response.status !== 200)
      {
        throw new RSIError(`Failed to retrieve progress tracker teams. Status code: ${response?.status}`);
      }

      try
      {
        const responseData = response.data;
        if (!responseData.data)
        {
          throw new RSIError('Failed to retrieve progress tracker teams. API returned no data.');
        }

        if ('errors' in responseData.data)
        {
          console.error(responseData.data.errors);
          throw new RSIError(`Progress tracker teams data retrieval failed: API returned errors: ${JSON.stringify(responseData.data.errors)}`);
        }

        if (!responseData.data.progressTracker || !responseData.data.progressTracker.teams)
        {
          throw new RSIError('Progress tracker teams data retrieval failed: API returned no teams.');
        }

        const page = responseData.data.progressTracker.teams;
        teams.push(...page.metaData);
        totalCount = page.totalCount;
      } catch (e)
      {
        console.error(e);
        throw e instanceof RSIError ? e : new RSIError(e instanceof Error ? e.message : `Unexpected error: ${e}`);
      }

      offset += this.limit;
    } while (offset < totalCount);

    return teams;
  }
}
