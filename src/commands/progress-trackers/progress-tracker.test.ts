import fs from 'fs';
import path from 'path';
import
{
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi
} from 'vitest';
import { HttpClient, ProgressTrackers } from '../../index';
import progressTrackerSchema from '../../schemas/progress_tracker.json';
import progressTrackerInfoSchema from '../../schemas/progress_tracker_info.json';
import { assertValidSchema } from '../../utils/validator';

const GRAPHQL_URL = 'https://robertsspaceindustries.com/graphql';

describe('Progress Tracker', () =>
{
  let httpClient: HttpClient;
  let progressTracker: ProgressTracker;

  beforeEach(() =>
  {
    httpClient = new HttpClient();
    progressTracker = new ProgressTrackers(httpClient);
  });

  afterEach(() =>
  {
    vi.restoreAllMocks();
  });

  describe('getTeamsInRange', () =>
  {
    test('should return teams in range data', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200,
        data: JSON.parse(
          fs.readFileSync(
            path.join(__dirname, 'mocks/progress-tracker-teams.json'),
            'utf8'
          )
        )
      } as any);

      const data = await progressTracker.getTeamsInRange();

      expect(data).not.toBeNull();
      expect(data).toHaveLength(1);
      expect(data![0].slug).toBe('g42qg07ipfday');
      expect(data![0].title).toBe('Game Code (Persistent Universe)');
      assertValidSchema(data, progressTrackerSchema);
    });

    test('should call the GraphQL endpoint', async () =>
    {
      const spy = vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200,
        data: JSON.parse(
          fs.readFileSync(
            path.join(__dirname, 'mocks/progress-tracker-teams.json'),
            'utf8'
          )
        )
      } as any);

      await progressTracker.getTeamsInRange();

      expect(spy).toHaveBeenCalledWith(
        GRAPHQL_URL,
        expect.objectContaining({ operationName: 'teams' })
      );
    });

    test('should return null on API failure', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200,
        data: { data: null }
      } as any);

      const data = await progressTracker.getTeamsInRange();

      expect(data).toBeNull();
    });

    test('should return null on non-200 response', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 500,
        data: null
      } as any);

      const data = await progressTracker.getTeamsInRange();

      expect(data).toBeNull();
    });

    test('should accept custom date range', async () =>
    {
      const spy = vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200,
        data: JSON.parse(
          fs.readFileSync(
            path.join(__dirname, 'mocks/progress-tracker-teams.json'),
            'utf8'
          )
        )
      } as any);

      await progressTracker.getTeamsInRange('2023-01-01', '2023-12-31');

      expect(spy).toHaveBeenCalledWith(
        GRAPHQL_URL,
        expect.objectContaining({
          variables: expect.objectContaining({
            startDate: '2023-01-01',
            endDate: '2023-12-31'
          })
        })
      );
    });
  });

  describe('getTeamDeliverableInfo', () =>
  {
    const deliverablesData = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, 'mocks/progress-tracker-deliverables.json'),
        'utf8'
      )
    );

    const disciplinesData = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, 'mocks/progress-tracker-disciplines.json'),
        'utf8'
      )
    );

    test('should return deliverables with discipline info', async () =>
    {
      vi.spyOn(httpClient, 'post')
        .mockResolvedValueOnce({ status: 200, data: deliverablesData } as any)
        .mockResolvedValueOnce({ status: 200, data: disciplinesData } as any);

      const data = await progressTracker.getTeamDeliverableInfo('g42qg07ipfday');

      expect(data).not.toBeNull();
      expect(data).toHaveLength(1);
      expect(data![0].slug).toBe('core-tech-improvements');
      expect(data![0].disciplines).toBeDefined();
      expect(data![0].disciplines!.title).toBe('Art');
      assertValidSchema(data, progressTrackerInfoSchema);
    });

    test('should return null on API failure for deliverables', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200,
        data: { data: null }
      } as any);

      const data = await progressTracker.getTeamDeliverableInfo('g42qg07ipfday');

      expect(data).toBeNull();
    });

    test('should return null on non-200 response', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 500,
        data: null
      } as any);

      const data = await progressTracker.getTeamDeliverableInfo('g42qg07ipfday');

      expect(data).toBeNull();
    });

    test('should call GraphQL with deliverables operationName', async () =>
    {
      const spy = vi.spyOn(httpClient, 'post')
        .mockResolvedValueOnce({ status: 200, data: deliverablesData } as any)
        .mockResolvedValueOnce({ status: 200, data: disciplinesData } as any);

      await progressTracker.getTeamDeliverableInfo('g42qg07ipfday');

      expect(spy).toHaveBeenCalledWith(
        GRAPHQL_URL,
        expect.objectContaining({ operationName: 'deliverables' })
      );
    });
  });
});
