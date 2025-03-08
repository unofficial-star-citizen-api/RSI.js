import { RSI } from '../src/index';
import { assertValidSchema } from './utils/validator';

describe('Ship', () => {
  test('should return ship data', async () => {
    const rsi = new RSI();
    const data = await rsi.ships.search({ name: 'Cutlass Black' });

    expect(data).not.toBeNull();
    assertValidSchema(data, 'ship.json');
  });
});
