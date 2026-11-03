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
import { HttpClient, OrganizationMembersSearchParams, Organizations } from '../../index';

export type TestMembersParams = {
  mockFile: string;
  params: OrganizationMembersSearchParams;
};

describe('Organizations', () =>
{
  describe('searchMembers', () =>
  {
    let httpClient: HttpClient;
    let organization: Organizations;

    beforeEach(() =>
    {
      httpClient = new HttpClient();
      organization = new Organizations(httpClient);
    });

    test('should get members', async () =>
    {
      const spy = vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200,
        data: JSON.parse(fs.readFileSync(
          path.join(__dirname, 'mocks', 'organization-members-TEST.json'),
          'utf8'
        ))
      } as never);

      const members = await organization.searchMembers({ sid: 'TEST' });

      expect(members).toBeDefined();
      expect(members.length).toBe(27);

      expect(members[5].display).toBe('Force');
      expect(members[5].handle).toBe('ForceProductions');
      expect(members[5].meta.url).toBe('https://robertsspaceindustries.com/citizens/ForceProductions');
      expect(members[5].image).toBe('https://cdn.robertsspaceindustries.com/static/images/account/avatar_default_big.jpg');
      expect(members[5].roles).toStrictEqual([]);
      expect(members[5].rank).toBe('Cadet');
      expect(members[5].stars).toBe(0);

      spy.mockRestore();
    });

    test('should get members of role index 1', async () =>
    {
      const spy = vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200,
        data: JSON.parse(fs.readFileSync(
          path.join(__dirname, 'mocks', 'organization-members-TEST-founder.json'),
          'utf8'
        ))
      } as never);

      const members = await organization.searchMembers({ sid: 'TEST', roleIndex: 1 });

      expect(members).toBeDefined();
      expect(members.length).toBe(2);

      expect(members[0].display).toBe('Montoya');
      expect(members[0].handle).toBe('Montoya');
      expect(members[0].meta.url).toBe('https://robertsspaceindustries.com/citizens/Montoya');
      expect(members[0].image).toBe('https://robertsspaceindustries.com/media/s40k5rnvzl32ur/avatar/Forumavatar.png');
      expect(members[0].roles).toStrictEqual(['Founder', 'Officer', 'Recruitment', 'Ministry of Truth &amp;amp; Love']);
      expect(members[0].rank).toBe('Admiral');
      expect(members[0].stars).toBe(5);

      expect(members[1].display).toBe('Citizen 404');
      expect(members[1].handle).toBe('Citizen404');
      expect(members[1].meta.url).toBe('https://robertsspaceindustries.com/citizens/Citizen404');
      expect(members[1].image).toBe('https://robertsspaceindustries.com/media/n0ntbnjkgja12r/avatar/Citizen_Yellow.png');
      expect(members[1].roles).toStrictEqual(['Founder', 'Officer', 'Recruitment', 'Ministry of Truth &amp;amp; Love']);
      expect(members[1].rank).toBe('Admiral');
      expect(members[1].stars).toBe(5);

      spy.mockRestore();
    });

    test('should skip restricted members of the fixture and parse every other one', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200,
        data: JSON.parse(fs.readFileSync(path.join(__dirname, 'mocks', 'organization-members-TEST.json'), 'utf8'))
      } as never);

      const members = await organization.searchMembers({ sid: 'TEST' });

      // The fixture has 32 entries, 5 of them restricted
      expect(members).toHaveLength(27);
      expect(new Set(members.map(member => member.handle)).size).toBe(27);
      for (const member of members)
      {
        expect(member.handle).toMatch(/^[a-zA-Z0-9_-]+$/);
        expect(member.display).not.toBe('');
        expect(member.meta.url).toBe(`https://robertsspaceindustries.com/citizens/${member.handle}`);
        expect(member.image).toMatch(/^https:\/\//);
        expect(member.rank).not.toBe('');
        expect(member.stars).toBeGreaterThanOrEqual(0);
        expect(member.stars).toBeLessThanOrEqual(5);
      }
    });

    test('should parse partial stars, trim values and skip duplicates', async () =>
    {
      const member = (handle: string, stars: string, extra = '') => `
        <li class="member-item">
          <a class="membercard" href="/citizens/${handle}">
            <span class="thumb"><img src="/media/x/avatar/${handle}.png"></span>
            <ul class="rolelist"> <li class="role"> Officer </li> </ul>
            <span class="name"> Display ${handle} </span>
            <span class="nick"> ${handle} </span>
            <span class="stars" style="width: ${stars};"></span>
            <span class="rank">
              Captain
            </span>
            ${extra}
          </a>
        </li>`;

      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200,
        data: {
          success: 1,
          data: {
            html: member('Alpha', '60%')
              + member('Alpha', '100%')
              + member('Hidden', '100%', '<span class="restriction"></span>')
              + member('Bravo', '20%')
          }
        }
      } as never);

      const members = await organization.searchMembers({ sid: 'TEST' });

      expect(members).toEqual([
        {
          handle: 'Alpha',
          display: 'Display Alpha',
          meta: { url: 'https://robertsspaceindustries.com/citizens/Alpha' },
          image: 'https://robertsspaceindustries.com/media/x/avatar/Alpha.png',
          roles: ['Officer'],
          rank: 'Captain',
          stars: 3
        },
        {
          handle: 'Bravo',
          display: 'Display Bravo',
          meta: { url: 'https://robertsspaceindustries.com/citizens/Bravo' },
          image: 'https://robertsspaceindustries.com/media/x/avatar/Bravo.png',
          roles: ['Officer'],
          rank: 'Captain',
          stars: 1
        }
      ]);
    });
  });
});
