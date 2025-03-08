import { Organization } from '../index';
import { assertValidSchema } from './validator';

describe('Organization', () => {
  test.each([
    ['SIBYLLA'],
    ['PROTECTORA'],
    ['ODINT'],
    ['HWFC'],
    ['STARD']
  ])('should return organization data for %s', async (sid) => {
    const org = new Organization(sid);
    const data = await org.execute();

    expect(data).not.toBeNull();
    assertValidSchema(data, 'organization.json');
  });
});
