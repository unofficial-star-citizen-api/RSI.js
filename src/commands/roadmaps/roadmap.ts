import { HttpClient } from '@/http-client';
import
{
  RoadmapBoard,
  RSIRoadmapRelease,
  RSIRoadmapResponse
} from './interfaces';

/**
 * Roadmap class for retrieving Star Citizen roadmap information
 */
export class Roadmaps
{
  private readonly urlRoadmapSC = 'https://robertsspaceindustries.com/api/roadmap/v1/boards/1';
  private readonly urlRoadmapS42 = 'https://robertsspaceindustries.com/api/roadmap/v1/boards/2';
  private readonly httpClient: HttpClient;

  /**
   * @param board - The roadmap board ("starcitizen" or "squadron42")
   * @param version - The starcitizen version (optional)
   */
  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  /**
   * Execute the command to retrieve roadmap information
   */
  public async getBoardReleases(board: RoadmapBoard, version?: string): Promise<RSIRoadmapRelease[] | null>
  {
    let request;

    if (board === 'starcitizen')
    {
      request = await this.httpClient.get<RSIRoadmapResponse>(this.urlRoadmapSC);
    }
    else if (board === 'squadron42')
    {
      request = await this.httpClient.get<RSIRoadmapResponse>(this.urlRoadmapS42);
    }
    else
    {
      throw new Error(`Invalid board: ${board}`);
    }

    if (request === null || request.status !== 200)
    {
      throw new Error(`Failed to retrieve roadmap data for board: ${board}`);
    }

    const response = request.data;
    if (response.success !== 1 || !response.data || !response.data.releases)
    {
      throw new Error(`Invalid response from roadmap API for board: ${board}`);
    }


    const categories: Record<number, string> = {};
    for (const category of response.data.categories)
    {
      categories[category.id] = category.name;
    }

    const releases = response.data.releases;
    for (const release of releases)
    {
      for (const card of release.cards)
      {
        card.category_name = categories[card.category_id];
      }
    }

    if (version === undefined)
    {
      return releases;
    }

    for (const release of releases)
    {
      if (release.name === version)
      {
        return [release];
      }
    }

    return [];
  }
}
