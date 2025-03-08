import { Telemetry } from '../index';
import { assertValidSchema } from './validator';

describe('Telemetry', () => {
  test('should return telemetry data', async () => {
    const telemetry = new Telemetry('MONTH', '3.7');
    const data = await telemetry.search();

    expect(data).not.toBeNull();
    assertValidSchema(data, 'telemetry.json');
  });
});

