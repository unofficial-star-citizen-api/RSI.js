import { HttpClient } from '../../http-client';

interface RSIRoadmapCard
{
  id: number;
  name: string;
  description: string;
  category_id: number;
  category_name?: string;
  [key: string]: unknown;
}

interface RSIRoadmapRelease
{
  id: number;
  name: string;
  description: string;
  cards: RSIRoadmapCard[];
  [key: string]: unknown;
}

interface RSIRoadmapCategory
{
  id: number;
  name: string;
  [key: string]: unknown;
}

/**
 * Roadmap class for retrieving Star Citizen roadmap information
 */
export class Roadmap
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
  public async getBoardReleases(board: 'starcitizen' | 'squadron42', version?: string): Promise<RSIRoadmapRelease[] | null>
  {
    let req;

    if (board === 'starcitizen')
    {
      req = await this.httpClient.get<{
        success: number;
        data?: {
          releases: RSIRoadmapRelease[];
          categories: RSIRoadmapCategory[];
        };
      }>(this.urlRoadmapSC);
    } else if (board === 'squadron42')
    {
      req = await this.httpClient.get<{
        success: number;
        data?: {
          releases: RSIRoadmapRelease[];
          categories: RSIRoadmapCategory[];
        };
      }>(this.urlRoadmapS42);
    } else
    {
      return null;
    }

    if (req === null || req.status !== 200)
    {
      return null;
    }

    try
    {
      const resp = req.data;

      // Check response
      if (resp.success !== 1 || !resp.data || !resp.data.releases)
      {
        return null;
      }

      const releases = resp.data.releases;
      const categories = resp.data.categories;

      const cats: Record<number, string> = {};
      for (const c of categories)
      {
        cats[c.id] = c.name;
      }

      for (const r of releases)
      {
        for (const c of r.cards)
        {
          c.category_name = cats[c.category_id];
        }
      }

      if (version === undefined)
      {
        return releases;
      }

      for (const r of releases)
      {
        if (r.name === version)
        {
          return [r];
        }
      }

      return [];
    } catch (e)
    {
      console.error(e);
      return null;
    }
  }
}
