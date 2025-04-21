import { HttpClient } from '../../http-client';

interface RSITimeAllocation
{
  startDate: string;
  endDate: string;
  uuid: string;
  partialTime: boolean;
  __typename: string;
}

interface RSITeam
{
  title: string;
  description: string;
  uuid: string;
  abbreviation: string;
  startDate: string;
  endDate: string;
  numberOfDeliverables: number;
  slug: string;
  timeAllocations: RSITimeAllocation[];
  __typename: string;
}

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
  public async getTeamsInRange(dateMin = '2020-01-01', dateMax = '2022-12-31'): Promise<RSITeam[] | null>
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

    const req = await this.httpClient.post<{
      data?: {
        progressTracker: {
          teams: {
            totalCount: number;
            metaData: RSITeam[];
          };
        };
      };
    }>(this.urlProgressTracker, data);

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

      return resp.data.progressTracker.teams.metaData;
    } catch (e)
    {
      console.error(e);
      return null;
    }
  }
}
