import fs from 'fs';
import path from 'path';
import
{
  describe,
  expect,
  test
} from 'vitest';
import { Organizations, RSIOrganizationCharacteristicsArchetype, RSIOrganizationCharacteristicsCommitment } from '../../index';
import { HttpClientMock } from '../../mocks/http-client.mock';
import { RSIOrganizationNotFoundError } from './errors';

describe('Organization with HttpClientMock', () =>
{
  describe('get', () =>
  {
    test('should return organization data', async () =>
    {
      // Create our mock HttpClient
      const httpClientMock = new HttpClientMock();

      // Set up the mock response for the organization URL
      httpClientMock.mockResponse(
        'https://robertsspaceindustries.com/orgs/TEST',
        fs.readFileSync(
          path.join(__dirname, 'mocks', 'organization-description.html'),
          'utf8'
        )
      );

      // Create the organization controller with our mock client
      const organization = new Organizations(httpClientMock);

      const data = await organization.get('TEST');

      expect(data).not.toBeNull();
      expect(data?.sid).toBe('TEST');
      expect(data?.name).toBe('TEST Squadron - Best Squardon!');
      expect(data?.meta.url).toBe('https://robertsspaceindustries.com/orgs/TEST');
      expect(data?.logo).toBe('https://robertsspaceindustries.com/media/ihh8ge4y6eqfir/logo/TEST-Logo.png');
      expect(data?.banner).toBe('https://robertsspaceindustries.com/media/p1603c268qhkfr/banner/TEST-Banner.png');
      expect(data?.membersCount).toBe(23431);
      expect(data?.archetype).toBe(RSIOrganizationCharacteristicsArchetype.Organization);
      expect(data?.commitment).toBe(RSIOrganizationCharacteristicsCommitment.Casual);
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
    });

    test('should throw an error for non-existing organization', async () =>
    {
      // Create our mock HttpClient
      const httpClientMock = new HttpClientMock();

      // Axios resolves non-2xx responses, so mock a 404 response instead of an error
      httpClientMock.mockResponse(
        'https://robertsspaceindustries.com/orgs/NOTFOUND',
        fs.readFileSync(path.join(__dirname, 'mocks', 'organization-not-found.html'), 'utf8'),
        404
      );

      // Create the organization controller with our mock client
      const organization = new Organizations(httpClientMock);

      await expect(organization.get('NOTFOUND')).rejects.toThrow(RSIOrganizationNotFoundError);
      await expect(organization.get('NOTFOUND')).rejects.toThrow('Organization not found: NOTFOUND');
    });
  });
});
