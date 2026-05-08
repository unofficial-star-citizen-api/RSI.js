import fs from 'fs';
import path from 'path';
import { OrganizationMembersSearchParams } from '../../src/commands/organization/organization-search-members';
import { HttpClient, Organization } from '../../src/index';

export type TestMembersParams = {
  mockFile: string;
  params: OrganizationMembersSearchParams;
};

describe('Organization', () =>
{
  describe('searchMembers', () =>
  {
    let httpClient: HttpClient;
    let organization: Organization;

    beforeEach(() =>
    {
      httpClient = new HttpClient();
      organization = new Organization(httpClient);
    });

    test('should get members', async () =>
    {
      const spy = jest.spyOn(httpClient, 'post').mockResolvedValue({
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
      expect(members[5].url).toBe('https://robertsspaceindustries.com/citizens/ForceProductions');
      expect(members[5].image).toBe('https://cdn.robertsspaceindustries.com/static/images/account/avatar_default_big.jpg');
      expect(members[5].roles).toStrictEqual([]);
      expect(members[5].rank).toBe('Cadet');
      expect(members[5].stars).toBe(0);

      spy.mockRestore();
    });

    test('should get members of role index 1', async () =>
    {
      const spy = jest.spyOn(httpClient, 'post').mockResolvedValue({
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
      expect(members[0].url).toBe('https://robertsspaceindustries.com/citizens/Montoya');
      expect(members[0].image).toBe('https://robertsspaceindustries.com/media/s40k5rnvzl32ur/avatar/Forumavatar.png');
      expect(members[0].roles).toStrictEqual(['Founder', 'Officer', 'Recruitment', 'Ministry of Truth &amp;amp; Love']);
      expect(members[0].rank).toBe('Admiral');
      expect(members[0].stars).toBe(5);

      expect(members[1].display).toBe('Citizen 404');
      expect(members[1].handle).toBe('Citizen404');
      expect(members[1].url).toBe('https://robertsspaceindustries.com/citizens/Citizen404');
      expect(members[1].image).toBe('https://robertsspaceindustries.com/media/n0ntbnjkgja12r/avatar/Citizen_Yellow.png');
      expect(members[1].roles).toStrictEqual(['Founder', 'Officer', 'Recruitment', 'Ministry of Truth &amp;amp; Love']);
      expect(members[1].rank).toBe('Admiral');
      expect(members[1].stars).toBe(5);

      spy.mockRestore();
    });
  });
});