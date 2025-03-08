import { RSI } from '../src/index';
import { assertValidSchema } from './validator';

describe('Organization Members', () => {
  test.each([
    ['SIBYLLA', 1],
    ['PROTECTORA', 3],
    ['CORCOP', 1],
    ['IPIX', 3]
  ])('should return organization members for %s page %i', async (sid, page) => {
    const rsi = new RSI();
    const data = await rsi.organization.getOrganizationMembers(sid, { page });

    expect(data).not.toBeNull();
    assertValidSchema(data, 'organization_members.json');
  });
});
