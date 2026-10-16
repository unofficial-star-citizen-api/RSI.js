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
  let progressTracker: ProgressTrackers;

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

      const data = await progressTracker.getTeams();

      expect(data).not.toBeNull();
      expect(data).toHaveLength(1);
      expect(data![0].slug).toBe('g42qg07ipfday');
      expect(data![0].title).toBe('Game Code (Persistent Universe)');
      expect(data![0].startDate).toBeInstanceOf(Date);
      expect(data![0].endDate).toBeInstanceOf(Date);
      expect(data![0].timeAllocations?.[0].startDate).toBeInstanceOf(Date);
      expect(data![0].timeAllocations?.[0].endDate).toBeInstanceOf(Date);
      assertValidSchema(JSON.parse(JSON.stringify(data)), progressTrackerSchema);
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

      await progressTracker.getTeams();

      expect(spy).toHaveBeenCalledWith(
        GRAPHQL_URL,
        expect.objectContaining({ operationName: 'teams' })
      );
    });

    test('should throw on API failure (no data)', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200,
        data: { data: null }
      } as any);

      await expect(progressTracker.getTeams()).rejects.toThrow();
    });

    test('should throw on non-200 response', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 500,
        data: null
      } as any);

      await expect(progressTracker.getTeams()).rejects.toThrow();
    });

    test('should fetch every offset and return all teams together', async () =>
    {
      const firstPage = JSON.parse(
        fs.readFileSync(
          path.join(__dirname, 'mocks/progress-tracker-teams.json'),
          'utf8'
        )
      );
      firstPage.data.progressTracker.teams.totalCount = 21;
      const secondPage = structuredClone(firstPage);
      secondPage.data.progressTracker.teams.metaData[0].slug = 'second-team';
      secondPage.data.progressTracker.teams.metaData[0].title = 'Second Team';

      const spy = vi.spyOn(httpClient, 'post')
        .mockResolvedValueOnce({ status: 200, data: firstPage } as any)
        .mockResolvedValueOnce({ status: 200, data: secondPage } as any);

      const teams = await progressTracker.getTeams();

      expect(teams).toHaveLength(2);
      expect(teams.map(team => team.slug)).toEqual(['g42qg07ipfday', 'second-team']);
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenNthCalledWith(
        1,
        GRAPHQL_URL,
        expect.objectContaining({ variables: expect.objectContaining({ offset: 0, limit: 20 }) })
      );
      expect(spy).toHaveBeenNthCalledWith(
        2,
        GRAPHQL_URL,
        expect.objectContaining({ variables: expect.objectContaining({ offset: 20, limit: 20 }) })
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

    test('should return all deliverables from the team-filtered response', async () =>
    {
      const response = structuredClone(deliverablesData);
      response.data.progressTracker.deliverables.totalCount = 2;
      response.data.progressTracker.deliverables.metaData.push({
        ...structuredClone(response.data.progressTracker.deliverables.metaData[0]),
        uuid: 'deliverable-uuid-002',
        slug: 'another-deliverable'
      });

      const spy = vi.spyOn(httpClient, 'post')
        .mockResolvedValueOnce({ status: 200, data: response } as any);

      const data = await progressTracker.getDeliverablesByTeamSlug('team-slug');

      expect(data).toHaveLength(2);
      expect(data.map(deliverable => deliverable.slug)).toEqual([
        'core-tech-improvements',
        'another-deliverable'
      ]);
      expect(data[0].card?.release?.title).toBe('4.0');
      expect(data[0].projects[0].title).toBe('Star Citizen');
      expect(data[0].startDate).toBeInstanceOf(Date);
      expect(data[0].startDate.toISOString()).toBe('2021-01-04T00:00:00.000Z');
      expect(data[0].endDate).toBeInstanceOf(Date);
      expect(data[0].endDate.toISOString()).toBe('2021-06-30T00:00:00.000Z');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        GRAPHQL_URL,
        expect.objectContaining({ variables: expect.objectContaining({ teamSlug: 'team-slug' }) })
      );
      data.forEach(deliverable => assertValidSchema(
        JSON.parse(JSON.stringify(deliverable)),
        progressTrackerInfoSchema
      ));
    });

    test('should throw on API failure for deliverables', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200,
        data: { data: null }
      } as any);

      await expect(progressTracker.getDeliverablesByTeamSlug('g42qg07ipfday')).rejects.toThrow();
    });

    test('should throw on non-200 response', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 500,
        data: null
      } as any);

      await expect(progressTracker.getDeliverablesByTeamSlug('g42qg07ipfday')).rejects.toThrow();
    });

    test('should call GraphQL with deliverables operationName', async () =>
    {
      const spy = vi.spyOn(httpClient, 'post')
        .mockResolvedValueOnce({ status: 200, data: deliverablesData } as any);

      await progressTracker.getDeliverablesByTeamSlug('g42qg07ipfday');

      expect(spy).toHaveBeenCalledWith(
        GRAPHQL_URL,
        expect.objectContaining({ operationName: 'deliverables' })
      );
    });
  });
});
