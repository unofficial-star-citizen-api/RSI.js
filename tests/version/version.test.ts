import
{
  beforeEach,
  describe,
  expect,
  test
} from 'vitest';
import { Version } from '../../src/commands/version/version';
import { PatchNote } from '../../src/commands/version/version-patch-notes';
import { Roadmap } from '../../src/commands/version/version-roadmap';
import { Spectrum } from '../../src/commands/version/version-spectrum';
import { HttpClient } from '../../src/http-client';

describe('Version', () =>
{
  let httpClient: HttpClient;
  let version: Version;

  beforeEach(() =>
  {
    httpClient = new HttpClient();
    version = new Version(httpClient);
  });

  test('should create Version instance with proper structure', () =>
  {
    // Verify instance is created
    expect(version).toBeInstanceOf(Version);

    // Verify all required properties exist and are of correct type
    expect(version.spectrum).toBeInstanceOf(Spectrum);
    expect(version.patchNote).toBeInstanceOf(PatchNote);
    expect(version.roadmap).toBeInstanceOf(Roadmap);
  });

  test('should pass the httpClient to child components', () =>
  {
    // Mock HttpClient
    const mockHttpClient = new HttpClient();

    // Create new Version instance with the mock client
    const testVersion = new Version(mockHttpClient);

    // Verify the httpClient was passed to each component
    expect(testVersion.spectrum['httpClient']).toBe(mockHttpClient);
    expect(testVersion.patchNote['httpClient']).toBe(mockHttpClient);
    expect(testVersion.roadmap['httpClient']).toBe(mockHttpClient);
  });
});
