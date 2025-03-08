import { BaseCommand } from '@interfaces';
import { Connector } from '@services';

interface RoadmapCard {
  id: number;
  name: string;
  description: string;
  category_id: number;
  category_name?: string;
  [key: string]: unknown;
}

interface RoadmapRelease {
  id: number;
  name: string;
  description: string;
  cards: RoadmapCard[];
  [key: string]: unknown;
}

interface RoadmapCategory {
  id: number;
  name: string;
  [key: string]: unknown;
}

/**
 * Roadmap class for retrieving Star Citizen roadmap information
 */
export class Roadmap extends BaseCommand<RoadmapRelease[]> {
  private readonly urlRoadmapSC = "https://robertsspaceindustries.com/api/roadmap/v1/boards/1";
  private readonly urlRoadmapS42 = "https://robertsspaceindustries.com/api/roadmap/v1/boards/2";
  private readonly board: string;
  private readonly version?: string;
  private connector: Connector;

  /**
   * @param board - The roadmap board ("starcitizen" or "squadron42")
   * @param version - The starcitizen version (optional)
   */
  constructor(board: string, version?: string) {
    super();
    this.board = board;
    this.version = version;
    this.connector = new Connector();
  }

  /**
   * Execute the command to retrieve roadmap information
   */
  public async execute(): Promise<RoadmapRelease[] | null> {
    let req;

    if (this.board === "starcitizen") {
      req = await this.connector.request<{
        success: number;
        data?: {
          releases: RoadmapRelease[];
          categories: RoadmapCategory[];
        };
      }>(this.urlRoadmapSC, null, {}, 'get');
    } else if (this.board === "squadron42") {
      req = await this.connector.request<{
        success: number;
        data?: {
          releases: RoadmapRelease[];
          categories: RoadmapCategory[];
        };
      }>(this.urlRoadmapS42, null, {}, 'get');
    } else {
      return null;
    }

    if (req === null || req.status !== 200) {
      return null;
    }

    try {
      const resp = req.data;

      // Check response
      if (resp.success !== 1 || !resp.data || !resp.data.releases) {
        return null;
      }

      const releases = resp.data.releases;
      const categories = resp.data.categories;

      const cats: Record<number, string> = {};
      for (const c of categories) {
        cats[c.id] = c.name;
      }

      for (const r of releases) {
        for (const c of r.cards) {
          c.category_name = cats[c.category_id];
        }
      }

      if (this.version === undefined) {
        return releases;
      }

      for (const r of releases) {
        if (r.name === this.version) {
          return [r];
        }
      }

      return [];
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
