import { RSI } from '../src/index';
import { assertValidSchema } from './validator';

describe('Organization', () => {
  test.each([
    ['SIBYLLA'],
    ['PROTECTORA'],
    ['ODINT'],
    ['HWFC'],
    ['STARD']
  ])('should return organization data for %s', async (sid) => {
    const rsi = new RSI();
    const data = await rsi.organization.findOrganization(sid);

    expect(data).not.toBeNull();
    assertValidSchema(data, 'organization.json');
  });
});
