import { RSIError } from '@/errors';
import { HttpClient } from '@/http-client';
import { createLogger } from '@/logger';
import { ProgressTrackerHelper } from './helpers';
import { RSIProgressTrackerDeliverable, RSIProgressTrackerDeliverableResponse } from './interfaces';

/**
 * Deliverable queries behind {@link ProgressTrackers}. Use `rsi.progressTrackers` instead.
 * @hidden
 */
export class ProgressTrackerDeliverable
{
  private readonly urlProgressTracker = 'https://robertsspaceindustries.com/graphql';
  private readonly limit: number = 20;
  private readonly httpClient: HttpClient;
  private readonly logger = createLogger(ProgressTrackerDeliverable.name);

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
   * @returns A promise that resolves to an array of RSIProgressTrackerDeliverable objects within the specified date range
   */
  public async getDeliverables(): Promise<RSIProgressTrackerDeliverable[]>
  {
    this.logger.info('Fetching progress tracker deliverables');
    return this.fetchDeliverables();
  }

  /**
   * Get deliverables filtered by team slug
   * @param teamSlug - The slug identifier of the team to filter deliverables by
   * @returns A promise that resolves to the deliverables associated with the specified team slug
   */
  public async getDeliverablesByTeamSlug(teamSlug: string): Promise<RSIProgressTrackerDeliverable[]>
  {
    this.logger.info('Fetching progress tracker deliverables by team', { teamSlug });
    return this.fetchDeliverables(teamSlug);
  }

  /**
   * Get deliverables from the progress tracker
   */
  private async fetchDeliverables(teamSlug?: string): Promise<RSIProgressTrackerDeliverable[]>
  {
    const dateMax = new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0];
    const data = {
      operationName: 'deliverables',
      query: `query deliverables(
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
        ...(teamSlug ? { teamSlug } : {}),
        startDate: '2020-01-01',
        endDate: dateMax,
        offset: 0,
        limit: this.limit
      }
    };

    const deliverables: RSIProgressTrackerDeliverable[] = [];
    let offset = 0;
    let totalCount: number;

    do
    {
      const response = await this.httpClient.post<RSIProgressTrackerDeliverableResponse>(
        this.urlProgressTracker,
        { ...data, variables: { ...data.variables, offset } }
      );

      if (response === null || response.status !== 200)
      {
        throw new RSIError(`Failed to retrieve deliverables data from ${this.urlProgressTracker}`);
      }

      try
      {
        const responseData = response.data;
        ProgressTrackerHelper.assertNoErrors(responseData.errors, 'Deliverables', teamSlug);

        if (!responseData.data)
        {
          throw new RSIError('Deliverables data retrieval failed: API returned no data.');
        }

        if (!responseData.data.progressTracker || !responseData.data.progressTracker.deliverables)
        {
          throw new RSIError('Deliverables data retrieval failed: API returned no deliverables.');
        }

        const page = responseData.data.progressTracker.deliverables.metaData;
        deliverables.push(...page.map(deliverable => ({
          ...deliverable,
          startDate: new Date(deliverable.startDate),
          endDate: new Date(deliverable.endDate),
          updateDate: new Date(deliverable.updateDate),
          card: deliverable.card ? {
            ...deliverable.card,
            updateDate: new Date(deliverable.card.updateDate)
          } : null,
          projects: deliverable.projects ? deliverable.projects.map(project => ({
            ...project,
            logo: HttpClient.toAbsoluteUrl(project.logo)!
          })) : []
        })));
        totalCount = responseData.data.progressTracker.deliverables.totalCount;
      }
      catch (e)
      {
        throw e instanceof RSIError ? e : new RSIError(e instanceof Error ? e.message : `Unexpected error: ${e}`);
      }
      offset += this.limit;
    } while (offset < totalCount);

    return deliverables;
  }
}
