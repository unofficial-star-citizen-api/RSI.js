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
import { HttpClient, Organizations } from '../../src/index';

describe('Organization', () =>
{
  describe('search', () =>
  {
    let httpClient: HttpClient;
    let organization: Organization;

    beforeEach(() =>
    {
      httpClient = new HttpClient();
      organization = new Organizations(httpClient);
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

      const organizations = await organization.search();

      expect(organizations).not.toBeNull();
      expect(organizations).toHaveLength(32);

      expect(organizations[0].sid).toBe('ITCL');
      expect(organizations[0].name).toBe('Inter-Tide Coalition');
      expect(organizations[0].icon).toBe('https://robertsspaceindustries.com/media/q6tmp9xcwu4esr/avatar/ITCL-Logo.png');
      expect(organizations[0].href).toBe('https://robertsspaceindustries.com/orgs/ITCL');
      expect(organizations[0].characteristics.archetype).toBe('Syndicate');
      expect(organizations[0].characteristics.commitment).toBe('Hardcore');
      expect(organizations[0].characteristics.isRecruiting).toBe(true);
      expect(organizations[0].characteristics.isRoleplay).toBe(true);
      expect(organizations[0].characteristics.language).toBe('English');
      expect(organizations[0].characteristics.membersCount).toBe(17);

      spy.mockRestore();
    });
  });
});
