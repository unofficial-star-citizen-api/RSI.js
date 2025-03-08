import { Stats } from '../index';
import { assertValidSchema } from './validator';

describe('Stats', () => {
  test('should return stats data', async () => {
    const stats = new Stats();
    const data = await stats.execute();

    expect(data).not.toBeNull();
    assertValidSchema(data, 'stats.json');
  });
});
