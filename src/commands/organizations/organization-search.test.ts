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

      // Every cell must be fully parsed, not only the first one
      for (const org of results)
      {
        expect(org.sid).toMatch(/^[A-Z0-9_-]+$/i);
        expect(org.name).not.toBe('');
        expect(org.meta.url).toBe(`https://robertsspaceindustries.com/orgs/${org.sid}`);
        expect(org.icon).toMatch(/^https:\/\//);
        expect(Object.values(RSIOrganizationCharacteristicsArchetype)).toContain(org.characteristics.archetype);
        expect(Object.values(RSIOrganizationCharacteristicsCommitment)).toContain(org.characteristics.commitment);
        expect(org.characteristics.language).not.toBe('');
        expect(Number.isInteger(org.characteristics.membersCount)).toBe(true);
      }

      // The fixture contains both role play values
      expect(results.filter(org => org.characteristics.isRoleplay)).toHaveLength(17);
      expect(results.filter(org => !org.characteristics.isRoleplay)).toHaveLength(15);

      spy.mockRestore();
    });

    test('should parse "No" values and formatted member counts', async () =>
    {
      const html = `
        <div class="org-cell ">
          <a href="/orgs/NOPE">
            <span class="thumb"><img src="/media/x/avatar/NOPE-Logo.png"></span>
            <h3 class="name">Nope Corp</h3>
            <span class="symbol">NOPE</span>
            <span class="label">Archetype: </span><span class="value">PMC</span>
            <span class="label">Lang: </span><span class="value">French</span>
            <span class="label">Commitment: </span><span class="value">Casual</span>
            <span class="label">Recruiting: </span><span class="value recruiting">No</span>
            <span class="label">Role play: </span><span class="value roleplay">No</span>
            <span class="label">Members: </span><span class="value">12,345</span>
          </a>
        </div>`;

      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200,
        data: { success: 1, data: { html } }
      } as any);

      const [org] = await organizations.search();

      expect(org).toEqual({
        sid: 'NOPE',
        name: 'Nope Corp',
        icon: 'https://robertsspaceindustries.com/media/x/avatar/NOPE-Logo.png',
        meta: { url: 'https://robertsspaceindustries.com/orgs/NOPE' },
        characteristics: {
          archetype: RSIOrganizationCharacteristicsArchetype.PMC,
          commitment: RSIOrganizationCharacteristicsCommitment.Casual,
          language: 'French',
          isRecruiting: false,
          isRoleplay: false,
          membersCount: 12345
        }
      });
    });
  });
});
