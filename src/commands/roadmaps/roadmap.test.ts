import
{
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi
} from 'vitest';
import fs from 'fs';
import path from 'path';
import { HttpClient, RSIError } from '../../index';
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

  describe('getBoards', () =>
  {
    const INIT_URL = 'https://robertsspaceindustries.com/api/roadmap/v1/init';
    const fixture = (file: string): any => JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf8'));

    test('should parse every board', async () =>
    {
      const spy = vi.spyOn(httpClient, 'get').mockResolvedValue({ status: 200, data: fixture('mocks/roadmap-init.json') } as any);

      const boards = await roadmap.getBoards();

      expect(spy).toHaveBeenCalledWith(INIT_URL);
      expect(boards.map(board => board.board)).toEqual([RSIRoadmapBoard.StarCitizen, RSIRoadmapBoard.Squadron42]);
      expect(boards[0]).toEqual({
        meta: { url: 'https://robertsspaceindustries.com/roadmap/board/1-Release-View' },
        id: 1,
        board: RSIRoadmapBoard.StarCitizen,
        slug: 'Release-View',
        name: 'Release View',
        description: expect.stringMatching(/^Live Version: 4\.10\.3 \(\[more info\]/),
        // RSI writes "The Release View" with a narrow no-break space, returned as-is
        body: expect.stringMatching(/^# The\sRelease View/),
        order: 0,
        infoHeading: 'Roadmap: Caveats',
        notification: {
          enabled: true,
          title: 'Roadmap Roundup for November 18, 2026',
          body: '([Read Now](https://robertsspaceindustries.com/spectrum/community/SC/forum/3/thread/roadmap-roundup-november-18-2026))'
        },
        thumbnail: {
          square: 'https://robertsspaceindustries.com/media/8iv5eqjfabb80r/heap_infobox/Logos.png',
          rect: 'https://robertsspaceindustries.com/media/8iv5eqjfabb80r/product_thumb_large/Logos.png',
          large: 'https://robertsspaceindustries.com/media/8iv5eqjfabb80r/hub_large/Logos.png',
          source: 'https://robertsspaceindustries.com/media/8iv5eqjfabb80r/source/Logos.png'
        },
        background: expect.objectContaining({ source: 'https://robertsspaceindustries.com/media/l3m8eaws8oxrpr/source/Roadmap_RV_Prod.jpg' }),
        lastUpdated: '2026-11-21T16:07:42.000Z'
      });
      expect(boards[1]).toMatchObject({ id: 2, name: 'Squadron 42', background: undefined, notification: { body: expect.stringMatching(/^Learn more/) } });
    });

    test('should return the description as-is, PTU and ETF announcements included', async () =>
    {
      vi.spyOn(httpClient, 'get').mockResolvedValue({ status: 200, data: fixture('../versions/mocks/roadmap-live-ptu.json') } as any);

      const [sc] = await roadmap.getBoards();

      expect(sc.description).toContain('PTU Version: 4.0.2 PTU 9584587 RC1');
    });

    test('should throw RSIHttpError on a non-200 response', async () =>
    {
      vi.spyOn(httpClient, 'get').mockResolvedValue({ status: 503, data: null } as any);

      await expect(roadmap.getBoards()).rejects.toMatchObject({ name: 'RSIHttpError', status: 503, url: INIT_URL });
    });

    test('should throw RSIError on an unsuccessful payload', async () =>
    {
      vi.spyOn(httpClient, 'get').mockResolvedValue({ status: 200, data: { success: 0, code: 'ErrUnknown', msg: 'Something failed', data: null } } as any);

      await expect(roadmap.getBoards()).rejects.toThrow(new RSIError('Query failed from RSI (Something failed)'));
    });

    test('should throw RSIError when the payload has no boards', async () =>
    {
      vi.spyOn(httpClient, 'get').mockResolvedValue({ status: 200, data: { success: 1, code: 'OK', msg: 'OK', data: {} } } as any);

      await expect(roadmap.getBoards()).rejects.toThrow('Roadmap API returned no boards');
    });
  });
});
