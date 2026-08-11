import { HttpClient } from '@/http-client';
import
{
  RoadmapBoard,
  RSIRoadmap,
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
  public async getBoardReleases(board: RoadmapBoard): Promise<RSIRoadmap | null>
  {
    let request;

    switch (board)
    {
    case RoadmapBoard.StarCitizen:
      request = await this.httpClient.get<RSIRoadmapResponse>(this.urlRoadmapSC);
      break;
    case RoadmapBoard.Squadron42:
      request = await this.httpClient.get<RSIRoadmapResponse>(this.urlRoadmapS42);
      break;
    default:
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

    return response.data;
  }
}
