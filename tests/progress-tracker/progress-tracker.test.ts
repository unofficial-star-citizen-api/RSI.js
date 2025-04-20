import fs from 'fs';
import path from 'path';
import { HttpClient, ProgressTracker } from '../../src/index';
import { assertValidSchema } from '../utils/validator';

describe('Progress Tracker', () =>
{
  let httpClient: HttpClient;
  let progressTracker: ProgressTracker;

  beforeEach(() =>
  {
    httpClient = new HttpClient();
    progressTracker = new ProgressTracker(httpClient);
  });

  test('should return teams in range data', async () =>
  {
    // Mock the HTTP client get method to return our HTML
    jest.spyOn(httpClient, 'get').mockResolvedValue({
      data: fs.readFileSync(
        path.join(__dirname, 'mocks/progress-tracker.json'),
        'utf8'
      )
    } as any);

    const data = await progressTracker.getTeamsInRange();

    expect(data).not.toBeNull();
    assertValidSchema(data, 'progress_tracker.json');
  });

  test('should return progress tracker info data', async () =>
  {
    const data = await progressTracker.getTeamDeliverableInfo('g42qg07ipfday');

    expect(data).not.toBeNull();
    assertValidSchema(data, 'progress_tracker_info.json');
  });
});
