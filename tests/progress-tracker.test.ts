import { RSI } from '../src/index';
import { assertValidSchema } from './validator';

describe('Progress Tracker', () => {
  test('should return progress tracker data', async () => {
    const rsi = new RSI();
    const data = await rsi.progressTracker.getTeamsInRange();

    expect(data).not.toBeNull();
    assertValidSchema(data, 'progress_tracker.json');
  });

  test('should return progress tracker info data', async () => {
    const rsi = new RSI();
    const data = await rsi.progressTracker.getTeamDeliverableInfo('g42qg07ipfday');

    expect(data).not.toBeNull();
    assertValidSchema(data, 'progress_tracker_info.json');
  });
});
