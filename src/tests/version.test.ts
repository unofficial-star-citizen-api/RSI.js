import { Version } from '../index';
import { assertValidSchema } from './validator';

describe('Version', () => {
  test('should return version data', async () => {
    const version = new Version();
    const data = await version.search();

    expect(data).not.toBeNull();
    assertValidSchema(data, 'version.json');
  });
});
