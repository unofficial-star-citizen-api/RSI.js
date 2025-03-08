import { RSI } from '../src/index';
import { assertValidSchema } from './utils/validator';
import statsSchema from './schemas/stats.json';

describe('Stats', () => {
  test('should return stats data', async () => {
    const rsi = new RSI();
    const data = await rsi.fundingGoals.getCrowStats('hour');

    expect(data).not.toBeNull();
    assertValidSchema(data, statsSchema);
  });
});
