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
      // .text() always returns a string, so check the actual content of each section
      expect(data?.headline.html).toContain('<h1>Welcome Test Pilot!</h1>');
      expect(data?.headline.plaintext).toContain('Welcome Test Pilot!');
      expect(data?.headline.plaintext).not.toContain('<');
      expect(data?.history.html).toContain('<h2 class="tab-title">History</h2>');
      expect(data?.history.plaintext).toContain('Why Join TEST?');
      expect(data?.manifesto.html).toContain('<h2 class="tab-title">Manifesto</h2>');
      expect(data?.manifesto.plaintext).toContain('Ok, here is my plan');
      expect(data?.charter.html).toContain('<h2 class="tab-title">Charter</h2>');
      expect(data?.charter.plaintext).toContain('You have the right to');
    });

    test('should return undefined sections when the page has no content', async () =>
    {
      const httpClientMock = new HttpClientMock();

      // Keep only the heading of the fixture
      const html = fs.readFileSync(path.join(__dirname, 'mocks', 'organization-description.html'), 'utf8');
      httpClientMock.mockResponse(
        'https://robertsspaceindustries.com/orgs/TEST',
        html.slice(0, html.indexOf('<div class="content join-us clearfix">')) + '</div>'
      );

      const data = await new Organizations(httpClientMock).get('TEST');

      expect(data.name).toBe('TEST Squadron - Best Squardon!');
      expect(data.headline).toEqual({ html: undefined, plaintext: '' });
      expect(data.charter).toEqual({ html: undefined, plaintext: '' });
    });

    test('should throw when the page has no heading', async () =>
    {
      const httpClientMock = new HttpClientMock();
      httpClientMock.mockResponse('https://robertsspaceindustries.com/orgs/TEST', '<div class="content-wrapper"></div>');

      await expect(new Organizations(httpClientMock).get('TEST')).rejects.toThrow('Failed to find organization heading for TEST');
    });

    test('should keep slashes in organization name', async () =>
    {
      const httpClientMock = new HttpClientMock();

      // Same fixture, but with a name containing slashes
      httpClientMock.mockResponse(
        'https://robertsspaceindustries.com/orgs/TEST',
        fs.readFileSync(
          path.join(__dirname, 'mocks', 'organization-description.html'),
          'utf8'
        ).replace('TEST Squadron - Best Squardon!', 'Protectorat (EU/QC/974/PC)')
      );

      const organization = new Organizations(httpClientMock);

      const data = await organization.get('TEST');

      expect(data?.name).toBe('Protectorat (EU/QC/974/PC)');
      expect(data?.sid).toBe('TEST');
    });

    test('should keep the name when there is no separator before the symbol', async () =>
    {
      const httpClientMock = new HttpClientMock();
      httpClientMock.mockResponse(
        'https://robertsspaceindustries.com/orgs/TEST',
        '<div class="heading"><div class="inner"><h1>A/B <span class="symbol">TEST</span></h1></div></div>'
      );

      const data = await new Organizations(httpClientMock).get('TEST');

      expect(data.name).toBe('A/B');
      expect(data.sid).toBe('TEST');
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
