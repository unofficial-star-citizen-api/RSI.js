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

    test('should throw error on not found response for getUserProfile', async () =>
    {
      // Mock a 404 response
      const spy = vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 404,
        data: '<html><body>Not found</body></html>'
      } as any);

      await expect(user.getProfile('NonExistentUser')).rejects.toThrowError(`User profile not found for handle: "NonExistentUser"`);

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
      expect(data?.enlisted).toBe(new Date('25 Aug 2016').toISOString());

      spy.mockRestore();
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

      await expect(user.getOrganization('NonExistentUser')).rejects.toThrowError(`User organization not found for handle: "NonExistentUser"`);

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
