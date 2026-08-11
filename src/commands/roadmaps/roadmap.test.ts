import
{
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi
} from 'vitest';
import { HttpClient } from '../../index';
import { RSIRoadmapBoard } from './interfaces';
import { Roadmaps } from './roadmap';

const SC_URL = 'https://robertsspaceindustries.com/api/roadmap/v1/boards/1';
const S42_URL = 'https://robertsspaceindustries.com/api/roadmap/v1/boards/2';

const MOCK_RELEASE = {
  id: '1',
  board_id: 1,
  name: '4.0',
  description: 'Star Citizen Alpha 4.0 release',
  released: 0,
  released_at: '',
  start_week: null,
  end_week: null,
  importer_id: 'imp-001',
  order: 1,
  patch_announcement_link: null,
  scheduled_at: null,
  time_created: 1609459200,
  time_modified: 1609459200,
  url_slug: '4-0',
  cards: [
    {
      id: '101',
      board_id: 1,
      title: 'Feature Title',
      description: 'Feature description',
      category_id: 1,
      completed: 0,
      body: 'Body text',
      importer_id: 'card-imp-001',
      inprogress: 0,
      name: 'feature-title',
      order: 1,
      release_id: 1,
      released: 0,
      scheduled_at: null,
      status: 'scheduled',
      tasks: 5,
      thumbnail: {
        id: 'thumb-001',
        urls: {
          large: 'https://cdn.rsi.com/large.jpg', rect: 'https://cdn.rsi.com/rect.jpg', source: 'https://cdn.rsi.com/source.jpg', square: 'https://cdn.rsi.com/square.jpg'
        }
      },
      time_created: 1609459200,
      time_modified: 1609459200,
      url_slug: 'feature-title'
    }
  ]
};

describe('Roadmap', () =>
{
  let httpClient: HttpClient;
  let roadmap: Roadmaps;

  beforeEach(() =>
  {
    httpClient = new HttpClient();
    roadmap = new Roadmaps(httpClient);
  });

  afterEach(() =>
  {
    vi.restoreAllMocks();
  });

  describe('getBoardReleases (Star Citizen)', () =>
  {
    test('should return Star Citizen roadmap releases', async () =>
    {
      vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: {
          success: 1,
          data: {
            releases: [MOCK_RELEASE],
            categories: [{ id: 1 }]
          }
        }
      } as any);

      const data = await roadmap.getBoardReleases(RSIRoadmapBoard.StarCitizen);

      expect(data).not.toBeNull();
      expect(Array.isArray(data!.releases)).toBe(true);
      expect(data!.releases.length).toBeGreaterThan(0);
      expect(data!.releases[0].name).toBe('4.0');
      expect(data!.releases[0].cards[0].category_id).toBe(1);
    });

    test('should throw an error on API failure', async () =>
    {
      vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: { success: 0 }
      } as any);

      await expect(roadmap.getBoardReleases(RSIRoadmapBoard.StarCitizen)).rejects.toThrow('Invalid response from roadmap API for board: starcitizen');
    });

    test('should throw an error on non-200 HTTP status', async () =>
    {
      vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 500,
        data: null
      } as any);

      await expect(roadmap.getBoardReleases(RSIRoadmapBoard.StarCitizen)).rejects.toThrow('Failed to retrieve roadmap data for board: starcitizen');
    });

    test('should merge category names into cards', async () =>
    {
      vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: {
          success: 1,
          data: {
            releases: [{ ...MOCK_RELEASE, cards: [{ ...MOCK_RELEASE.cards[0], category_id: 2 }] }],
            categories: [{ id: 1, name: 'Feature' }, { id: 2, name: 'Core Tech' }]
          }
        }
      } as any);

      const data = await roadmap.getBoardReleases(RSIRoadmapBoard.StarCitizen);

      expect(data).not.toBeNull();
      expect(data!.releases[0].cards[0].category_id).toBe(2);
    });
  });

  describe('getBoardReleases (Squadron 42)', () =>
  {
    test('should return Squadron 42 roadmap releases', async () =>
    {
      vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: {
          success: 1,
          data: {
            releases: [{ ...MOCK_RELEASE, board_id: 2 }],
            categories: [{ id: 1, name: 'Feature' }]
          }
        }
      } as any);

      const data = await roadmap.getBoardReleases(RSIRoadmapBoard.Squadron42);

      expect(data).not.toBeNull();
      expect(Array.isArray(data!.releases)).toBe(true);
      expect(data!.releases[0].board_id).toBe(2);
    });
  });

  describe('URL selection', () =>
  {
    test('should call SC board URL for starcitizen', async () =>
    {
      const spy = vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: { success: 1, data: { releases: [], categories: [] } }
      } as any);

      await roadmap.getBoardReleases(RSIRoadmapBoard.StarCitizen);

      expect(spy).toHaveBeenCalledWith(SC_URL);
    });

    test('should call S42 board URL for squadron42', async () =>
    {
      const spy = vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: { success: 1, data: { releases: [], categories: [] } }
      } as any);

      await roadmap.getBoardReleases(RSIRoadmapBoard.Squadron42);

      expect(spy).toHaveBeenCalledWith(S42_URL);
    });
  });
});
