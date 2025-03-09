import fs from 'fs';
import path from 'path';
import { PatchNote } from '../../src/commands/version/version-patch-notes';
import { HttpClient } from '../../src/http-client';


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
      jest.spyOn(httpClient, 'get').mockResolvedValue({
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
        link: '/comm-link/Patch-Notes/20445-Star-Citizen-Alpha-402',
        image: expect.stringContaining('3kba4ptbh57t3/channel_item_full.jpg'),
        comments: 0,
        time_ago: '1 week ago'
      });

      expect(patchNotes[1]).toMatchObject({
        title: 'Star Citizen Alpha 4.0.1',
        version: '4.0.1',
        link: '/comm-link/Patch-Notes/20418-Star-Citizen-Alpha-401',
        image: expect.stringContaining('3kba4ptbh57t3/channel_item_full.jpg'),
        comments: 0,
        time_ago: '2 months ago'
      });
    });

    test('should get latest patch note', async () =>
    {
      const latestPatchNote = await patchNote.getLatest();

      expect(latestPatchNote).toMatchObject({
        title: 'Star Citizen Alpha 4.0.2',
        version: '4.0.2',
        link: '/comm-link/Patch-Notes/20445-Star-Citizen-Alpha-402',
        image: expect.stringContaining('3kba4ptbh57t3/channel_item_full.jpg'),
        comments: 0,
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

    test('should return undefined when version not found', async () =>
    {
      const notFoundPatchNote = await patchNote.find('9.99');
      expect(notFoundPatchNote).toBeUndefined();
    });

    test('should handle empty HTML response', async () =>
    {
      const spy = jest.spyOn(httpClient, 'get').mockResolvedValue({
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
      const spy = jest.spyOn(httpClient, 'get').mockResolvedValue({
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