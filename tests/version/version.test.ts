import
{
  beforeEach,
  describe,
  expect,
  test
} from 'vitest';
import { Versions } from '../../src/commands/versions/version';
import { PatchNote } from '../../src/commands/versions/version-patch-notes';
import { Roadmap } from '../../src/commands/versions/version-roadmap';
import { Spectrum } from '../../src/commands/versions/version-spectrum';
import { HttpClient } from '../../src/http-client';

describe('Version', () =>
{
  let httpClient: HttpClient;
  let version: Versions;

  beforeEach(() =>
  {
    httpClient = new HttpClient();
    version = new Versions(httpClient);
  });

  test('should create Version instance with proper structure', () =>
  {
    // Verify instance is created
    expect(version).toBeInstanceOf(Versions);

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
    const testVersion = new Versions(mockHttpClient);

    // Verify the httpClient was passed to each component
    expect(testVersion.spectrum['httpClient']).toBe(mockHttpClient);
    expect(testVersion.patchNote['httpClient']).toBe(mockHttpClient);
    expect(testVersion.roadmap['httpClient']).toBe(mockHttpClient);
  });
});
