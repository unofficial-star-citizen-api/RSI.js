import fs from 'fs';
import path from 'path';
import { HttpClient, Organization } from '../../src/index';

describe('Organization', () =>
{
  describe('get', () =>
  {
    let httpClient: HttpClient;
    let organization: Organization;

    beforeEach(() =>
    {
      httpClient = new HttpClient();
      organization = new Organization(httpClient);
    });

    test('should return organization data for %s', async () =>
    {
      const spy = jest.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: fs.readFileSync(
          path.join(__dirname, 'mocks', 'organization-description.html'),
          'utf8'
        )
      } as any);

      const data = await organization.get('TEST');

      expect(data).not.toBeNull();
      expect(data?.sid).toBe('TEST');
      expect(data?.name).toBe('TEST Squadron - Best Squardon!');
      expect(data?.url).toBe('https://robertsspaceindustries.com/orgs/TEST');
      expect(data?.logo).toBe('https://robertsspaceindustries.com/media/ihh8ge4y6eqfir/logo/TEST-Logo.png');
      expect(data?.banner).toBe('https://robertsspaceindustries.com/media/p1603c268qhkfr/banner/TEST-Banner.png');
      expect(data?.membersCount).toBe(23431);
      expect(data?.focus.primary.image).toBe('https://robertsspaceindustries.com/media/5pcet2tbffqinr/icon/Social.png');
      expect(data?.focus.primary.name).toBe('Social');
      expect(data?.focus.secondary.image).toBe('https://robertsspaceindustries.com/media/7nk9059i8lnfmr/icon/Security.png');
      expect(data?.focus.secondary.name).toBe('Security');
      expect(data?.headline.html).not.toBeUndefined();
      expect(data?.headline.plaintext).not.toBeUndefined();
      expect(data?.history.html).not.toBeUndefined();
      expect(data?.history.plaintext).not.toBeUndefined();
      expect(data?.manifesto.html).not.toBeUndefined();
      expect(data?.manifesto.plaintext).not.toBeUndefined();
      expect(data?.charter.html).not.toBeUndefined();
      expect(data?.charter.plaintext).not.toBeUndefined();

      spy.mockRestore();
    });

    test('should throw an error for non-existing organization', async () =>
    {
      const spy = jest.spyOn(httpClient, 'get').mockResolvedValue({
        status: 404,
        data: fs.readFileSync(
          path.join(__dirname, 'mocks', 'organization-not-found.html'),
          'utf8'
        )
      } as any);

      await expect(organization.get('{INVALID}')).rejects.toThrow('Organization "{INVALID}" not found');

      spy.mockRestore();
    });
  });
});