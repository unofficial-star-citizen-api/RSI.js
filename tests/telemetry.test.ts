import { RSI } from '../src/index';
import { assertValidSchema } from './validator';

describe('Telemetry', () => {
  test('should return telemetry data', async () => {
    const rsi = new RSI();
    const data = await rsi.telemetry.search('MONTH', '3.7');

    expect(data).not.toBeNull();
    assertValidSchema(data, 'telemetry.json');
  });
});

