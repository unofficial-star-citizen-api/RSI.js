import { ProgressTrackerList, ProgressTrackerDeliverable } from '../index';
import { assertValidSchema } from './validator';

describe('Progress Tracker', () => {
  test('should return progress tracker data', async () => {
    const tracker = new ProgressTrackerList();
    const data = await tracker.list();

    expect(data).not.toBeNull();
    assertValidSchema(data, 'progress_tracker.json');
  });

  test('should return progress tracker info data', async () => {
    const trackerInfo = new ProgressTrackerDeliverable('g42qg07ipfday');
    const data = await trackerInfo.getDeliverables();

    expect(data).not.toBeNull();
    assertValidSchema(data, 'progress_tracker_info.json');
  });
});
