import { RSI } from '../src/index';
import { assertValidSchema } from './utils/validator';
import telemetrySchema from './schemas/telemetry.json';

describe('Telemetry', () => {
  test('should return telemetry data', async () => {
    const rsi = new RSI();
    const data = await rsi.telemetry.community('MONTH', 'sc-alpha-4.0');

    expect(data).not.toBeNull();
    assertValidSchema(data, telemetrySchema);
  });
});

