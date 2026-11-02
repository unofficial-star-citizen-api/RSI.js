import fs from 'fs';
import path from 'path';
import
{
  beforeEach,
  describe,
  expect,
  test,
  vi
} from 'vitest';
import { HttpClient, Organizations, RSIOrganizationCharacteristicsArchetype, RSIOrganizationCharacteristicsCommitment } from '../../index';

describe('Organization', () =>
{
  describe('search', () =>
  {
    let httpClient: HttpClient;
    let organizations: Organizations;

    beforeEach(() =>
    {
      httpClient = new HttpClient();
      organizations = new Organizations(httpClient);
    });

    test('should return organization search results', async () =>
    {
      const spy = vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200,
        data: JSON.parse(fs.readFileSync(
          path.join(__dirname, 'mocks', 'organization-search.json'),
          'utf8'
        ))
      } as any);

      const results = await organizations.search();

      expect(results).not.toBeNull();
      expect(results).toHaveLength(32);

      expect(results[0].sid).toBe('ITCL');
      expect(results[0].name).toBe('Inter-Tide Coalition');
      expect(results[0].icon).toBe('https://robertsspaceindustries.com/media/q6tmp9xcwu4esr/avatar/ITCL-Logo.png');
      expect(results[0].meta.url).toBe('https://robertsspaceindustries.com/orgs/ITCL');
      expect(results[0].characteristics.archetype).toBe(RSIOrganizationCharacteristicsArchetype.Syndicate);
      expect(results[0].characteristics.commitment).toBe(RSIOrganizationCharacteristicsCommitment.Hardcore);
      expect(results[0].characteristics.isRecruiting).toBe(true);
      expect(results[0].characteristics.isRoleplay).toBe(true);
      expect(results[0].characteristics.language).toBe('English');
      expect(results[0].characteristics.membersCount).toBe(17);

      spy.mockRestore();
    });
  });
});
