import { RSI } from '../src/index';
import { assertValidSchema } from './utils/validator';

describe('Stats', () => {
  test('should return stats data', async () => {
    const rsi = new RSI();
    const data = await rsi.stats.search();

    expect(data).not.toBeNull();
    assertValidSchema(data, 'stats.json');
  });
});
