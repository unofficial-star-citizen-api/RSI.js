import { ProgressTracker, ProgressTrackerInfo } from '../index';
import { assertValidSchema } from './validator';

describe('Progress Tracker', () => {
  test('should return progress tracker data', async () => {
    const tracker = new ProgressTracker();
    const data = await tracker.execute();

    expect(data).not.toBeNull();
    assertValidSchema(data, 'progress_tracker.json');
  });

  test('should return progress tracker info data', async () => {
    const trackerInfo = new ProgressTrackerInfo('g42qg07ipfday');
    const data = await trackerInfo.execute();

    expect(data).not.toBeNull();
    assertValidSchema(data, 'progress_tracker_info.json');
  });
});
