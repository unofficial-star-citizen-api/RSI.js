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
import { HttpClient } from '../../http-client';
import { RSIUserNotFoundError } from './errors';
import { Users } from './user';

describe('User', () =>
{
  describe('with mock files', () =>
  {
    let httpClient: HttpClient;
    let user: Users;

    beforeEach(() =>
    {
      httpClient = new HttpClient();
      user = new Users(httpClient);
    });

    // Tests with mock HTML files
    test.each([
      ['Dymerz', 'profile.html', '#1461338'],
      ['Dewderonomy', 'profile-redacted.html', '#711498']
    ])('should parse user profile data from HTML mock for %s', async (handle, mockFile, expectedId) =>
    {
      // Mock the HTTP client get method to return our mock HTML
      const spy = vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: fs.readFileSync(
          path.join(__dirname, 'mocks', mockFile),
          'utf8'
        )
      } as any);

      const data = await user.getProfile(handle);

      // Assertions
      expect(data).not.toBeNull();
      expect(data?.id).toBe(expectedId);
      expect(data?.handle).toBe(handle);

      spy.mockRestore();
    });

    test.each([
      ['back\\slash'],
      ['with space'],
      ['dot.ted'],
      [''],
      ['a'.repeat(61)]
    ])('should reject invalid handle %j before sending a request', async (handle) =>
    {
      const spy = vi.spyOn(httpClient, 'get');

      await expect(user.getProfile(handle)).rejects.toThrowError(`Invalid user handle: "${handle}"`);
      await expect(user.getOrganization(handle)).rejects.toThrowError(`Invalid user handle: "${handle}"`);

      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    test.each([
      ['Dymerz'],
      ['under_score'],
      ['da-sh'],
      ['a'.repeat(60)]
    ])('should accept valid handle %j', async (handle) =>
    {
      const spy = vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 404,
        data: ''
      } as any);

      await expect(user.getProfile(handle)).rejects.toThrow(RSIUserNotFoundError);

      spy.mockRestore();
    });

    test('should throw error on not found response for getUserProfile', async () =>
    {
      // Mock a 404 response
      const spy = vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 404,
        data: '<html><body>Not found</body></html>'
      } as any);

      await expect(user.getProfile('NonExistentUser')).rejects.toThrow(RSIUserNotFoundError);

      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });

    test('should throw error on non-200/404 response for getUserProfile', async () =>
    {
      // Mock a 500 error response
      const spy = vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 500,
        data: 'Server Error'
      } as any);

      await expect(user.getProfile('SomeUser')).rejects.toThrowError(`Failed to retrieve user profile data from https://robertsspaceindustries.com/citizens/SomeUser`);

      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });

    test('should extract profile locations correctly', async () =>
    {
      // Mock the HTTP client get method to return our mock HTML
      const spy = vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: fs.readFileSync(
          path.join(__dirname, 'mocks', 'profile.html'),
          'utf8'
        )
      } as any);

      const data = await user.getProfile('Dymerz');

      // Assertions for location
      expect(data).not.toBeNull();
      expect(data?.location).toEqual({
        country: 'France',
        region: 'Paris'
      });

      spy.mockRestore();
    });

    test('should extract profile fluency correctly', async () =>
    {
      // Mock the HTTP client get method to return our mock HTML
      const spy = vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: fs.readFileSync(
          path.join(__dirname, 'mocks', 'profile.html'),
          'utf8'
        )
      } as any);

      const data = await user.getProfile('Dymerz');

      // Assertions for fluency
      expect(data).not.toBeNull();
      expect(data?.fluency).toEqual(['French', 'English']);

      spy.mockRestore();
    });

    test('should extract main organization data correctly', async () =>
    {
      // Mock the HTTP client get method to return our mock HTML
      const spy = vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: fs.readFileSync(
          path.join(__dirname, 'mocks', 'organizations-multiple.html'),
          'utf8'
        )
      } as any);

      const data = await user.getOrganization('Terada');

      // Assertions for main organization
      expect(data).not.toBeNull();
      expect(data?.organization).toMatchObject({
        info: {
          sid: 'WACKO',
          name: 'Warning Collision Alert',
          rank: 'Président',
          stars: 5,
          members: 225
        },
        characteristics: {
          archetype: 'Corporation',
          primaryLanguage: 'French',
          primaryActivity: 'Social',
          recruiting: true,
          sectorOfActivity: 'Exploration',
          roleplay: false,
          commitment: 'Regular',
          exclusive: false
        }
      });

      spy.mockRestore();
    });

    test('should extract a main organization with slashes in its name and no affiliation', async () =>
    {
      vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: fs.readFileSync(path.join(__dirname, 'mocks', 'organizations.html'), 'utf8')
      } as any);

      const data = await user.getOrganization('X');

      expect(data?.organization).toEqual({
        info: {
          meta: { url: 'https://robertsspaceindustries.com/orgs/PROTECTORA' },
          sid: 'PROTECTORA',
          name: 'Protectorat (EU/QC/974/PC)',
          rank: 'Membre',
          stars: 0,
          image: 'https://robertsspaceindustries.com/media/1fvt89w8g12brr/heap_infobox/PROTECTORA-Logo.png',
          members: 1445
        },
        characteristics: {
          archetype: 'Corporation',
          primaryLanguage: 'French',
          primaryActivity: 'Security',
          recruiting: true,
          sectorOfActivity: 'Infiltration',
          roleplay: false,
          commitment: 'Hardcore',
          exclusive: true
        }
      });
      expect(data?.affiliations).toEqual([]);
    });

    test('should return an empty main organization when it is redacted', async () =>
    {
      vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: fs.readFileSync(path.join(__dirname, 'mocks', 'organizations-redacted.html'), 'utf8')
      } as any);

      const data = await user.getOrganization('X');

      expect(data?.organization.info).toEqual({
        meta: { url: undefined },
        sid: undefined,
        name: undefined,
        rank: undefined,
        stars: undefined,
        image: undefined,
        members: undefined
      });
      expect(Object.values(data!.organization.characteristics).every(value => value === undefined)).toBe(true);

      // Public affiliations are still returned
      expect(data?.affiliations).toEqual([{
        sid: 'OPPF',
        name: 'Operation Pitchfork',
        rank: 'Bacon Maker I',
        stars: 0,
        members: 5361,
        image: 'https://robertsspaceindustries.com/media/91scp32ik2k2ur/heap_infobox/OPPF-Logo.png'
      }]);
    });

    test('should return an empty main organization when the citizen has none', async () =>
    {
      vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: '<div class="profile-content"></div>'
      } as any);

      const data = await user.getOrganization('X');

      expect(data?.organization.info.sid).toBeUndefined();
      expect(data?.organization.info.meta.url).toBeUndefined();
      expect(data?.affiliations).toEqual([]);
    });

    test('should extract user affiliations correctly', async () =>
    {
      // Mock the HTTP client get method to return our mock HTML
      const spy = vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: fs.readFileSync(
          path.join(__dirname, 'mocks', 'organizations-multiple.html'),
          'utf8'
        )
      } as any);

      const data = await user.getOrganization('Terada');

      // Assertions for affiliations
      expect(data).not.toBeNull();
      expect(data?.affiliations).toHaveLength(2);
      expect(data?.affiliations?.at(0)).toMatchObject({
        sid: 'AVOCADO',
        name: 'Evocati - NDA',
        rank: 'Initiate',
        stars: 0,
        members: 2890
      });

      expect(data?.affiliations?.at(1)).toMatchObject({
        sid: 'THUNDERBSC',
        name: 'Thunderbirds Space Crew',
        rank: 'Commandant',
        stars: 5,
        members: 16
      });

      spy.mockRestore();
    });

    test('should extract all user profile information', async () =>
    {
      // Mock the HTTP client get method to return our mock HTML
      const spy = vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: fs.readFileSync(
          path.join(__dirname, 'mocks', 'profile.html'),
          'utf8'
        )
      } as any);

      const data = await user.getProfile('Dymerz');

      // Assertions for full profile extraction
      expect(data).not.toBeNull();
      expect(data?.meta.url).toEqual('https://robertsspaceindustries.com/citizens/Dymerz');
      expect(data?.id).toEqual('#1461338');
      expect(data?.display).toEqual('[ΩP] Dymerz');
      expect(data?.handle).toEqual('Dymerz');
      expect(data?.badge).toMatchObject({
        name: 'Gold Observer',
        image: 'https://robertsspaceindustries.com/media/1enn0ll36uj5wr/heap_thumb/ObserverBadge_Spectrum_Gold.png'
      });
      expect(data?.image).toEqual('https://robertsspaceindustries.com/media/90dffvdr5uxonr/heap_infobox/Rsi_profile.png');
      expect(data?.enlisted).toBeDefined();
      expect(data?.location?.country).toEqual('France');
      expect(data?.location?.region).toEqual('Paris');
      expect(data?.fluency).toMatchObject([
        'French', 'English'
      ]);
      expect(data?.website).toEqual('https://robertsspaceindustries.com/account/profile');
      expect(data?.bio.text).toContain('[UEX:374723]\n');
      expect(data?.bio.html).toContain('[UEX:374723]<br>\n');

      spy.mockRestore();
    });

    test('should handle valid enlisted date with missing location and fluency', async () =>
    {
      // Create a simple mock HTML without location or fluency
      const mockHtml = `
        <div class="profile-content overview-content clearfix">
          <p class="entry citizen-record">
            <span class="label">UEE Citizen Record</span>
            <strong class="value">#123456</strong>
          </p>
          <div class="info">
            <p class="entry">
              <span class="label">Handle name</span>
              <strong class="value">TestUser</strong>
              <span class="label">Enlisted</span>
              <strong class="value">25 Aug 2016</strong>
            </p>
          </div>
        </div>
      `;

      const spy = vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: mockHtml
      } as any);

      const data = await user.getProfile('TestUser');

      // Assertions
      expect(data).not.toBeNull();
      expect(data?.location).toBeUndefined();
      expect(data?.fluency).toEqual([]);
      expect(data?.enlisted).toBe('2016-08-25T00:00:00.000Z');

      spy.mockRestore();
    });

    test('should parse the enlisted date independently of the local timezone', async () =>
    {
      // vitest.config.ts runs the tests in UTC+14, a local-time parse would give the previous day
      expect(new Date().getTimezoneOffset()).not.toBe(0);

      vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: fs.readFileSync(path.join(__dirname, 'mocks', 'profile.html'), 'utf8')
      } as any);

      const data = await user.getProfile('Dymerz');

      // The page shows "Aug 19, 2016"
      expect(data?.enlisted).toBe('2016-08-19T00:00:00.000Z');
    });

    test('should parse a redacted profile', async () =>
    {
      vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: fs.readFileSync(path.join(__dirname, 'mocks', 'profile-redacted.html'), 'utf8')
      } as any);

      const data = await user.getProfile('Dewderonomy');

      expect(data).toMatchObject({
        id: '#711498',
        display: 'Brandon Van Orr',
        handle: 'Dewderonomy',
        badge: {
          name: 'Mercenary',
          image: 'https://robertsspaceindustries.com/media/kji9vcgdoaiibr/heap_thumb/Mercenary.png'
        },
        image: 'https://robertsspaceindustries.com/media/w0i4i84hml79qr/heap_infobox/AVCOM6.png',
        enlisted: '2015-01-03T00:00:00.000Z',
        fluency: ['English']
      });
      expect(data?.location).toBeUndefined();
      expect(data?.website).toBeUndefined();
      expect(data?.bio.text).toMatch(/^Been playing MMOs for over 25 years/);
    });

    test('should not report a badge when the citizen has none', async () =>
    {
      const mockHtml = `
        <div class="info">
          <p class="entry">
            <strong class="value">Test User</strong>
          </p>
          <p class="entry">
            <span class="label">Handle name</span>
            <strong class="value">TestUser</strong>
          </p>
        </div>
      `;

      vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: mockHtml
      } as any);

      const data = await user.getProfile('TestUser');

      expect(data?.display).toBe('Test User');
      expect(data?.handle).toBe('TestUser');
      expect(data?.badge).toBeUndefined();
    });

    test('should handle invalid enlisted date', async () =>
    {
      const mockHtml = `
        <div class="profile-content overview-content clearfix">
          <div class="info">
            <p class="entry">
              <span class="label">Enlisted</span>
              <strong class="value">not a date</strong>
            </p>
          </div>
        </div>
      `;

      const spy = vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: mockHtml
      } as any);

      const data = await user.getProfile('TestUser');

      expect(data).not.toBeNull();
      expect(data?.enlisted).toBeUndefined();

      spy.mockRestore();
    });

    test('should handle valid website', async () =>
    {
      const mockHtml = `
        <div class="profile-content overview-content clearfix">
          <div class="info">
            <p class="entry">
              <span class="label">Website</span>
              <a href="https://example.com" class="value">https://example.com</a>
            </p>
          </div>
        </div>
      `;

      const spy = vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: mockHtml
      } as any);

      const data = await user.getProfile('TestUser');

      expect(data).not.toBeNull();
      expect(data?.website).toBe('https://example.com');

      spy.mockRestore();
    });

    test('should throw error on 404 not found response for getAffiliations', async () =>
    {
      // Mock a 404 response
      const spy = vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 404,
        data: '<html><body>Not found</body></html>'
      } as any);

      await expect(user.getOrganization('NonExistentUser')).rejects.toThrow(RSIUserNotFoundError);

      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });

    test('should throw error on non-200/404 response for getAffiliations', async () =>
    {
      // Mock a 500 error response
      const spy = vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 500,
        data: 'Server Error'
      } as any);

      await expect(user.getOrganization('SomeUser')).rejects.toThrowError(`Failed to retrieve user organization data from https://robertsspaceindustries.com/citizens/SomeUser`);

      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });
  });
});
