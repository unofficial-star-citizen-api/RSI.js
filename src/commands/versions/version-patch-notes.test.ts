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
import { PatchNote } from './version-patch-notes';

describe('PatchNote', () =>
{
  let httpClient: HttpClient;
  let patchNote: PatchNote;

  beforeEach(() =>
  {
    httpClient = new HttpClient();
    patchNote = new PatchNote(httpClient);
  });

  describe('HTML Parsing', () =>
  {
    beforeEach(() =>
    {
      // Mock the HTTP client get method to return our HTML
      vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: fs.readFileSync(
          path.join(__dirname, 'mocks/patch-notes.html'),
          'utf8'
        )
      } as any);
    });

    test('should parse patch notes from HTML', async () =>
    {
      const patchNotes = await patchNote.getAll();

      expect(patchNotes).toHaveLength(20);
      expect(patchNotes[0]).toMatchObject({
        title: 'Star Citizen Alpha 4.0.2',
        version: '4.0.2',
        meta: { url: 'https://robertsspaceindustries.com/comm-link/Patch-Notes/20445-Star-Citizen-Alpha-402' },
        image: expect.stringContaining('3kba4ptbh57t3/channel_item_full.jpg'),
        commentCount: 0,
        time_ago: '1 week ago'
      });

      expect(patchNotes[1]).toMatchObject({
        title: 'Star Citizen Alpha 4.0.1',
        version: '4.0.1',
        meta: { url: 'https://robertsspaceindustries.com/comm-link/Patch-Notes/20418-Star-Citizen-Alpha-401' },
        image: expect.stringContaining('3kba4ptbh57t3/channel_item_full.jpg'),
        commentCount: 0,
        time_ago: '2 months ago'
      });
    });

    test('should keep the hotfix suffix in the version', async () =>
    {
      const patchNotes = await patchNote.getAll();

      expect(patchNotes[7]).toMatchObject({ title: 'Star Citizen Alpha 3.23.1a', version: '3.23.1a' });
      expect(patchNotes[8]).toMatchObject({ title: 'Star Citizen Alpha 3.23.1', version: '3.23.1' });
    });

    test('should return absolute image URLs', async () =>
    {
      const patchNotes = await patchNote.getAll();

      expect(patchNotes[3].image).toBe('https://robertsspaceindustries.com/media/ado2gi1swvr71r/channel_item_full/StarCitizen_RSI_Polaris_Banner.jpg');
      for (const note of patchNotes)
        expect(note.image).toMatch(/^https:\/\//);
    });

    test('should parse every field of every patch note', async () =>
    {
      const patchNotes = await patchNote.getAll();

      for (const note of patchNotes)
      {
        expect(note.title).toMatch(/^Star Citizen Alpha \d/);
        expect(note.version).toMatch(/^\d+(\.\d+)+[a-z]?$/);
        expect(note.meta.url).toMatch(/^https:\/\/robertsspaceindustries\.com\/comm-link\//);
        expect(note.time_ago).toMatch(/ago$/);
      }

      expect(patchNotes.map(note => note.commentCount)).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 33, 40, 34, 32, 42, 54, 40, 56, 55, 25]);
    });

    test('should parse the comment count', async () =>
    {
      // Every comment count in the fixture is 0, so give the first patch note a real count
      vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: fs.readFileSync(path.join(__dirname, 'mocks/patch-notes.html'), 'utf8')
          .replace('<div class="comments">0</div>', '<div class="comments">1,234</div>')
      } as any);

      const patchNotes = await patchNote.getAll();

      expect(patchNotes[0].commentCount).toBe(1234);
      expect(patchNotes[1].commentCount).toBe(0);
    });

    test('should return undefined comment count when it is missing', async () =>
    {
      vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: '<div id="channel"><a class="content-block2" href="/x"><div class="title">Star Citizen Alpha 4.1</div></a></div>'
      } as any);

      const patchNotes = await patchNote.getAll();

      expect(patchNotes).toHaveLength(1);
      expect(patchNotes[0].version).toBe('4.1');
      expect(patchNotes[0].commentCount).toBeUndefined();
      expect(patchNotes[0].image).toBeUndefined();
    });

    test('should get latest patch note', async () =>
    {
      const latestPatchNote = await patchNote.getLatest();

      expect(latestPatchNote).toMatchObject({
        title: 'Star Citizen Alpha 4.0.2',
        version: '4.0.2',
        meta: { url: 'https://robertsspaceindustries.com/comm-link/Patch-Notes/20445-Star-Citizen-Alpha-402' },
        image: expect.stringContaining('3kba4ptbh57t3/channel_item_full.jpg'),
        commentCount: 0,
        time_ago: '1 week ago'
      });
    });

    test('should find patch note by version', async () =>
    {
      const foundPatchNote = await patchNote.find('3.24.3');

      expect(foundPatchNote).toMatchObject({
        title: 'Star Citizen Alpha 3.24.3',
        version: '3.24.3'
      });
    });

    test('should prefer the exact version over a hotfix', async () =>
    {
      // 3.23.1a is newer than 3.23.1 but is not the version asked for
      expect((await patchNote.find('3.23.1'))?.version).toBe('3.23.1');
      expect((await patchNote.find('3.23.1a'))?.version).toBe('3.23.1a');
    });

    test('should match a version prefix on whole components only', async () =>
    {
      expect((await patchNote.find('4.0'))?.version).toBe('4.0.2');
      expect((await patchNote.find('3.24'))?.version).toBe('3.24.3');
      // "0.2" is a substring of "4.0.2" but not a version prefix
      expect(await patchNote.find('0.2')).toBeUndefined();
      // "3.2" is a string prefix of "3.24.3" but not a version prefix
      expect(await patchNote.find('3.2')).toBeUndefined();
    });

    test('should return undefined when version not found', async () =>
    {
      const notFoundPatchNote = await patchNote.find('9.99');
      expect(notFoundPatchNote).toBeUndefined();
    });

    test('should handle empty HTML response', async () =>
    {
      const spy = vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: '<div id="channel"></div>'
      } as any);

      const emptyPatchNotes = await patchNote.getAll();
      expect(emptyPatchNotes).toEqual([]);

      const latestPatchNote = await patchNote.getLatest();
      expect(latestPatchNote).toBeUndefined();

      spy.mockRestore();
    });

    test('should handle malformed HTML response', async () =>
    {
      const spy = vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 200,
        data: '<div>Malformed HTML</div>'
      } as any);

      const emptyPatchNotes = await patchNote.getAll();
      expect(emptyPatchNotes).toEqual([]);

      const latestPatchNote = await patchNote.getLatest();
      expect(latestPatchNote).toBeUndefined();

      spy.mockRestore();
    });
  });
});
