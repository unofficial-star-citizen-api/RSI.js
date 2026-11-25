import fs from 'fs';
import path from 'path';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { RSIError, RSIHttpError, RSINotFoundError } from '../../errors';
import { HttpClient } from '../../http-client';
import { RSI } from '../../rsi';
import
{
  RSISpectrumChannelId,
  RSISpectrumChannelNotFoundError,
  RSISpectrumCommunityId,
  RSISpectrumCommunityNotFoundError,
  RSISpectrumContentType,
  RSISpectrumParagraphStyle,
  RSISpectrumThreadNotFoundError,
  RSISpectrumThreadSort,
  Spectrum
} from './index';

/** Raw Spectrum response body saved in mocks/ */
const fixture = (name: string): any => JSON.parse(fs.readFileSync(path.join(__dirname, 'mocks', `${name}.json`), 'utf8'));
/** HTTP 200 response carrying a raw Spectrum body */
const respond = (body: unknown): any => ({ status: 200, data: body });
/** HTTP 200 response carrying a successful Spectrum body with this payload */
const ok = (data: unknown): any => respond({ success: 1, code: 'OK', msg: 'OK', data });
const fixtureResponse = (name: string): any => respond(fixture(name));
const validationFailure = (data: Record<string, string>): any => respond({ success: 0, code: 'ErrValidationFailed', msg: 'Validation failed', data });

describe('Spectrum', () =>
{
  let rsi: RSI;
  let httpClient: HttpClient;
  let spectrum: Spectrum;

  beforeEach(() =>
  {
    rsi = new RSI();
    httpClient = rsi.httpClient;
    spectrum = rsi.spectrum;
  });

  afterEach(() =>
  {
    vi.restoreAllMocks();
  });

  describe('getCommunities', () =>
  {
    test('parses the community list', async () =>
    {
      const spy = vi.spyOn(httpClient, 'post').mockResolvedValue(fixtureResponse('community-list'));

      const communities = await spectrum.getCommunities();

      expect(spy).toHaveBeenCalledWith('https://robertsspaceindustries.com/api/spectrum/v2/community/list', {});
      expect(communities).toEqual([
        expect.objectContaining({
          id: 1,
          slug: 'SC',
          name: 'Star Citizen',
          type: 'public',
          meta: { url: 'https://robertsspaceindustries.com/spectrum/community/SC' }
        })
      ]);
      expect(communities[0].avatar).toMatch(/^https:\/\//);
    });
  });

  describe('getChannels', () =>
  {
    test('parses the channels of the Star Citizen community by default', async () =>
    {
      const spy = vi.spyOn(httpClient, 'post').mockResolvedValue(fixtureResponse('channel-list'));

      const channels = await spectrum.getChannels();

      expect(spy).toHaveBeenCalledWith('https://robertsspaceindustries.com/api/spectrum/v2/forum/channel/list', { community_id: '1' });
      expect(channels.map(channel => channel.id)).toEqual([1, 3, 190048]);

      const patchNotes = channels.find(channel => channel.id === RSISpectrumChannelId.PatchNotes);
      expect(patchNotes).toEqual({
        meta: { url: 'https://robertsspaceindustries.com/spectrum/community/SC/forum/190048' },
        id: 190048,
        communityId: RSISpectrumCommunityId.StarCitizen,
        name: 'Patch Notes',
        description: undefined, // empty on RSI
        threadCount: 779,
        order: expect.any(Number),
        labels: [{ id: 14664, name: 'Patch Notes' }]
      });
    });

    test('throws RSISpectrumCommunityNotFoundError for an unknown community', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue(validationFailure({ community_id: 'community_id is not valid' }));

      const error = await spectrum.getChannels(999999).catch((e: unknown) => e);

      expect(error).toBeInstanceOf(RSISpectrumCommunityNotFoundError);
      expect(error).toBeInstanceOf(RSINotFoundError);
      expect(error).toMatchObject({ resource: 'Spectrum community', identifier: 999999 });
    });

    test.each([0, -1, 1.5, NaN])('throws Error for an invalid community ID (%s) without sending a request', async (communityId) =>
    {
      const spy = vi.spyOn(httpClient, 'post');

      await expect(spectrum.getChannels(communityId)).rejects.toThrow('Invalid Spectrum community ID');
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('getThreads', () =>
  {
    test('parses the first page, pinned threads included', async () =>
    {
      const spy = vi.spyOn(httpClient, 'post').mockResolvedValue(fixtureResponse('threads-p1'));

      const threads = await spectrum.getThreads(RSISpectrumChannelId.PatchNotes);

      expect(spy).toHaveBeenCalledWith('https://robertsspaceindustries.com/api/spectrum/v2/forum/channel/threads', {
        channel_id: '190048',
        page: 1,
        sort: 'newest',
        label_id: null
      });
      expect(threads).toHaveLength(6);
      expect(threads.filter(thread => thread.isPinned)).toHaveLength(3);
      expect(threads[0]).toEqual({
        meta: { url: 'https://robertsspaceindustries.com/spectrum/community/SC/forum/190048/thread/star-citizen-alpha-5-0-ptu-patch-notes-6' },
        id: 579706,
        slug: 'star-citizen-alpha-5-0-ptu-patch-notes-6',
        subject: '[Wave 3] Star Citizen Alpha 5.0 PTU Patch Notes 13273298',
        channelId: 190048,
        label: undefined,
        author: expect.objectContaining({
          handle: 'Wakapedia-CIG',
          displayName: 'Wakapedia-CIG',
          isGM: false,
          meta: { url: 'https://robertsspaceindustries.com/citizens/Wakapedia-CIG' }
        }),
        createdAt: '2026-11-24T17:48:23.000Z',
        modifiedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
        isPinned: true,
        isLocked: expect.any(Boolean),
        isErased: false,
        repliesCount: expect.any(Number),
        viewsCount: expect.any(Number),
        votes: 99,
        firstTrackedReplyId: undefined
      });
      expect(threads[0].author.badges).toContainEqual(expect.objectContaining({ name: 'Developer', icon: expect.stringMatching(/^https:\/\//) }));
      expect(threads.find(thread => thread.subject.includes('13248297'))?.firstTrackedReplyId).toBe(9257137);
    });

    test('leaves out the pinned threads RSI repeats after the first page', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue(fixtureResponse('threads-p2'));

      const threads = await spectrum.getThreads(RSISpectrumChannelId.PatchNotes, { page: 2 });

      expect(threads.map(thread => thread.subject)).toEqual([
        '[All Waves] Star Citizen Alpha 4.10 PTU Patch Notes 12373313',
        '[Wave 1] Star Citizen Alpha 4.10 PTU Patch Notes 12311913'
      ]);
    });

    test('sends the sort order and the label filter', async () =>
    {
      const spy = vi.spyOn(httpClient, 'post').mockResolvedValue(ok([]));

      await spectrum.getThreads(190048, { page: 3, sort: RSISpectrumThreadSort.Votes, labelId: 14664 });

      expect(spy).toHaveBeenCalledWith(expect.any(String), { channel_id: '190048', page: 3, sort: 'votes', label_id: '14664' });
    });

    test('maps a thread label', async () =>
    {
      const thread = { ...fixture('threads-p1').data[0], label: { id: 14664, name: 'Patch Notes' } };
      vi.spyOn(httpClient, 'post').mockResolvedValue(ok([thread]));

      const [result] = await spectrum.getThreads(190048);

      expect(result.label).toEqual({ id: 14664, name: 'Patch Notes' });
    });

    test('throws RSISpectrumChannelNotFoundError for an unknown channel', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue(validationFailure({ channel_id: 'channel_id is not valid' }));

      await expect(spectrum.getThreads(1234567890)).rejects.toThrow(RSISpectrumChannelNotFoundError);
    });

    test('throws RSIError for other validation failures', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue(validationFailure({ sort: 'sort is not valid' }));

      const error = await spectrum.getThreads(190048).catch((e: unknown) => e);

      expect(error).toBeInstanceOf(RSIError);
      expect(error).not.toBeInstanceOf(RSINotFoundError);
      expect((error as Error).message).toBe('Spectrum query failed (ErrValidationFailed: Validation failed) {"sort":"sort is not valid"}');
    });

    test('throws RSIHttpError on a non-200 response', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({ status: 503, data: 'Service Unavailable' } as any);

      await expect(spectrum.getThreads(190048)).rejects.toMatchObject({
        name: 'RSIHttpError',
        status: 503,
        url: 'https://robertsspaceindustries.com/api/spectrum/v2/forum/channel/threads'
      });
    });

    test('throws RSIError when the payload is not a list', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue(ok({ threads: [] }));

      await expect(spectrum.getThreads(190048)).rejects.toThrow('Spectrum returned no threads list');
    });

    test.each([
      [0, {}, 'channel ID'],
      [190048, { page: 0 }, 'page'],
      [190048, { labelId: -2 }, 'label ID']
    ])('throws Error for invalid input (%s, %o)', async (channelId, params, name) =>
    {
      const spy = vi.spyOn(httpClient, 'post');

      await expect(spectrum.getThreads(channelId, params)).rejects.toThrow(`Invalid Spectrum ${name}`);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('getThread', () =>
  {
    test('parses a PTU patch notes thread', async () =>
    {
      const spy = vi.spyOn(httpClient, 'post').mockResolvedValue(fixtureResponse('thread-ptu'));

      const thread = await spectrum.getThread('star-citizen-alpha-5-0-ptu-patch-notes-6');

      expect(spy).toHaveBeenCalledWith('https://robertsspaceindustries.com/api/spectrum/forum/thread/nested', {
        slug: 'star-citizen-alpha-5-0-ptu-patch-notes-6',
        sort: 'newest',
        target_reply_id: null
      });
      expect(thread).toMatchObject({
        meta: { url: 'https://robertsspaceindustries.com/spectrum/community/SC/forum/190048/thread/star-citizen-alpha-5-0-ptu-patch-notes-6' },
        id: 579706,
        slug: 'star-citizen-alpha-5-0-ptu-patch-notes-6',
        subject: '[Wave 3] Star Citizen Alpha 5.0 PTU Patch Notes 13273298',
        communityId: 1,
        channelId: 190048,
        label: undefined,
        author: { handle: 'Wakapedia-CIG', id: 429390 },
        createdAt: '2026-11-24T17:48:23.000Z',
        isPinned: true,
        isErased: false,
        votes: 99
      });

      const lines = thread.text.split('\n');
      expect(lines[0]).toBe('Alpha Patch 5.0 has been released and is now available to test on the PTU environment! Patch should now show: VERSION 5.0.0-PTU.13273298');
      expect(lines).toContain('Audience: Wave 3 testers');
      expect(thread.links).toEqual([]);

      expect(thread.content).toHaveLength(1);
      const [block] = thread.content;
      expect(block.type).toBe(RSISpectrumContentType.Text);
      if (block.type === RSISpectrumContentType.Text)
      {
        expect(block.paragraphs).toHaveLength(79);
        expect(block.paragraphs.some(paragraph => paragraph.style === RSISpectrumParagraphStyle.UnorderedListItem)).toBe(true);
        expect(block.paragraphs.some(paragraph => paragraph.style === RSISpectrumParagraphStyle.HeaderOne)).toBe(true);
      }
    });

    test('parses a LIVE hotfix thread and its tracked replies', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue(fixtureResponse('thread-hotfix'));

      const thread = await spectrum.getThread('star-citizen-alpha-4-10-live-hotfix-central');

      expect(thread.text.split('\n')).toContain('Latest LIVE Client CL: 13220821 ');
      expect(thread.links).toContain('https://status.robertsspaceindustries.com/');
      expect(thread.trackedReplies).toEqual([{ id: 9118520, author: 'Bault-CIG' }]);
      expect(thread.firstTrackedReplyId).toBe(9118520);
      expect(thread.repliesCount).toBe(361);
    });

    test('parses text, image and video blocks', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue(fixtureResponse('thread-media'));

      const thread = await spectrum.getThread('media-test-post');

      expect(thread.content.map(block => block.type)).toEqual([RSISpectrumContentType.Text, RSISpectrumContentType.Image, RSISpectrumContentType.Video]);
      const [text, image, video] = thread.content;

      expect(text).toEqual({
        type: RSISpectrumContentType.Text,
        paragraphs: [
          { style: RSISpectrumParagraphStyle.HeaderOne, text: 'Media test post', depth: 0, links: [], inlineStyles: [] },
          {
            style: RSISpectrumParagraphStyle.UnorderedListItem,
            text: 'See the status page',
            depth: 1,
            links: [{ text: 'status page', url: 'https://status.robertsspaceindustries.com/' }],
            inlineStyles: [{ offset: 4, length: 6, style: 'BOLD' }]
          },
          // Emoji entities are not links
          { style: RSISpectrumParagraphStyle.Unstyled, text: 'Nice work 🙂', depth: 0, links: [], inlineStyles: [] }
        ]
      });
      expect(thread.text).toBe('Media test post\nSee the status page\nNice work 🙂');

      expect(image).toEqual({
        type: RSISpectrumContentType.Image,
        images: [
          expect.objectContaining({ url: 'https://theverse.robertsspaceindustries.com/exampleupload/source.jpg', width: 2560, height: 1440 }),
          expect.objectContaining({ url: 'https://theverse.robertsspaceindustries.com/exampleupload2/source.jpg' })
        ]
      });
      if (image.type === RSISpectrumContentType.Image)
        expect(image.images[0].sizes).toEqual({
          mini: 'https://theverse.robertsspaceindustries.com/exampleupload/tavern_upload_mini.jpg',
          square: 'https://theverse.robertsspaceindustries.com/exampleupload/tavern_upload_square.jpg',
          small: 'https://theverse.robertsspaceindustries.com/exampleupload/tavern_upload_small.jpg',
          medium: 'https://theverse.robertsspaceindustries.com/exampleupload/tavern_upload_medium.jpg',
          large: 'https://theverse.robertsspaceindustries.com/exampleupload/tavern_upload_large.jpg'
        });

      expect(video).toEqual({
        type: RSISpectrumContentType.Video,
        video: {
          url: 'https://www.youtube-nocookie.com/embed/EXAMPLEVIDEO?feature=oembed',
          title: 'Example video',
          provider: 'YouTube',
          thumbnail: 'https://i.ytimg.com/vi/EXAMPLEVIDEO/hqdefault.jpg'
        }
      });
    });

    test('reads link entities from an object entity map', async () =>
    {
      const data = fixture('thread-media');
      const textBlock = data.data.content_blocks[0];
      textBlock.data.entityMap = { 0: textBlock.data.entityMap[0], 1: textBlock.data.entityMap[1] };
      vi.spyOn(httpClient, 'post').mockResolvedValue(respond(data));

      const thread = await spectrum.getThread('media-test-post');

      expect(thread.links).toEqual(['https://status.robertsspaceindustries.com/']);
    });

    test('skips unknown content blocks and warns about Lexical-only content', async () =>
    {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      vi.spyOn(console, 'info').mockImplementation(() => undefined);
      const logged = new RSI({ logging: true });
      const data = fixture('thread-ptu');
      data.data.content_blocks = [];
      data.data.lexical_content = { root: { children: [] } };
      vi.spyOn(logged.httpClient, 'post').mockResolvedValue(respond(data));

      const thread = await logged.spectrum.getThread('star-citizen-alpha-5-0-ptu-patch-notes-6');

      expect(thread.content).toEqual([]);
      expect(thread.text).toBe('');
      expect(warnSpy).toHaveBeenCalledWith('[Spectrum] Thread content is only available in the unsupported Lexical format', { slug: 'star-citizen-alpha-5-0-ptu-patch-notes-6' });

      data.data.content_blocks = [{ id: 1, type: 'poll', data: {} }];
      expect((await logged.spectrum.getThread('star-citizen-alpha-5-0-ptu-patch-notes-6')).content).toEqual([]);
    });

    test('throws RSISpectrumThreadNotFoundError for an unknown slug', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue(fixtureResponse('thread-not-found'));

      const error = await spectrum.getThread('this-thread-does-not-exist-xyz').catch((e: unknown) => e);

      expect(error).toBeInstanceOf(RSISpectrumThreadNotFoundError);
      expect(error).toMatchObject({ resource: 'Spectrum thread', identifier: 'this-thread-does-not-exist-xyz' });
      expect((error as RSISpectrumThreadNotFoundError).getStatus()).toBe(404);
    });

    test('throws RSIHttpError on a non-200 response', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({ status: 500, data: null } as any);

      await expect(spectrum.getThread('star-citizen-alpha-5-0-ptu-patch-notes-6')).rejects.toBeInstanceOf(RSIHttpError);
    });

    test.each(['', 'has spaces', '../etc/passwd', '-leading-dash'])('throws Error for an invalid slug (%j) without sending a request', async (slug) =>
    {
      const spy = vi.spyOn(httpClient, 'post');

      await expect(spectrum.getThread(slug)).rejects.toThrow('Invalid Spectrum thread slug');
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
