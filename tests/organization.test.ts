import { RSI } from '../src/index';
import { assertValidSchema } from './utils/validator';

describe('Organization', () => {
  describe('findOrganization', () => {
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

  describe('getOrganizationMembers', () => {
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
});