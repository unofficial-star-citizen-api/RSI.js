import { HttpClient } from '@/http-client';
import
{
  RSISpectrumContentBlock,
  RSISpectrumContentType,
  RSISpectrumImage,
  RSISpectrumLink,
  RSISpectrumParagraph,
  RSISpectrumParagraphStyle,
  RSISpectrumVideo
} from '../interfaces';
import
{
  SpectrumRawContentBlock,
  SpectrumRawDraftContent,
  SpectrumRawDraftEntity,
  SpectrumRawEmbed,
  SpectrumRawUpload
} from '../interfaces/raw/spectrum-raw.interface';

/**
 * Turns Spectrum's Draft.js content blocks into {@link RSISpectrumContentBlock}s.
 *
 * @hidden
 */
export class SpectrumContentHelper
{
  /**
   * Normalize raw content blocks. Blocks of an unknown type are skipped.
   *
   * @param blocks - Raw `content_blocks` of a thread or a reply
   * @returns The normalized blocks
   */
  public static parse(blocks: SpectrumRawContentBlock[]): RSISpectrumContentBlock[]
  {
    const result: RSISpectrumContentBlock[] = [];
    for (const block of blocks)
    {
      switch (block.type)
      {
      case RSISpectrumContentType.Text:
        result.push({ type: RSISpectrumContentType.Text, paragraphs: SpectrumContentHelper.parseText(block.data as SpectrumRawDraftContent) });
        break;
      case RSISpectrumContentType.Image:
        result.push({ type: RSISpectrumContentType.Image, images: SpectrumContentHelper.parseImages(block.data as SpectrumRawUpload[]) });
        break;
      case RSISpectrumContentType.Video:
        result.push({ type: RSISpectrumContentType.Video, video: SpectrumContentHelper.parseVideo(block.data as SpectrumRawEmbed) });
        break;
      }
    }
    return result;
  }

  /**
   * @param content - Normalized blocks
   * @returns Every paragraph of every text block, one per line
   */
  public static toText(content: RSISpectrumContentBlock[]): string
  {
    return content
      .flatMap(block => block.type === RSISpectrumContentType.Text ? block.paragraphs.map(paragraph => paragraph.text) : [])
      .join('\n');
  }

  /**
   * @param content - Normalized blocks
   * @returns Every distinct link URL of every text block
   */
  public static toLinks(content: RSISpectrumContentBlock[]): string[]
  {
    const urls = content.flatMap(block => block.type === RSISpectrumContentType.Text
      ? block.paragraphs.flatMap(paragraph => paragraph.links.map(link => link.url))
      : []);
    return [...new Set(urls)];
  }

  private static parseText(data: SpectrumRawDraftContent | undefined): RSISpectrumParagraph[]
  {
    const entityMap = data?.entityMap ?? [];
    const getEntity = (key: number): SpectrumRawDraftEntity | undefined =>
      Array.isArray(entityMap) ? entityMap[key] : entityMap[String(key)];

    return (data?.blocks ?? []).map(block => ({
      style: block.type as RSISpectrumParagraphStyle,
      text: block.text,
      depth: block.depth ?? 0,
      inlineStyles: (block.inlineStyleRanges ?? []).map(({
        offset, length, style 
      }) => ({
        offset, length, style 
      })),
      links: (block.entityRanges ?? []).flatMap((range): RSISpectrumLink[] =>
      {
        const entity = getEntity(range.key);
        if (entity?.type !== 'LINK' || typeof entity.data !== 'object')
          return [];

        const url = HttpClient.toAbsoluteUrl(entity.data.href ?? entity.data.url);
        return url ? [{ text: block.text.substring(range.offset, range.offset + range.length), url }] : [];
      })
    }));
  }

  private static parseImages(uploads: SpectrumRawUpload[] | undefined): RSISpectrumImage[]
  {
    return (uploads ?? [])
      .filter(upload => upload?.data?.url)
      .map(upload => ({
        url: HttpClient.toAbsoluteUrl(upload.data.url) as string,
        width: SpectrumContentHelper.toNumber(upload.data.image_width),
        height: SpectrumContentHelper.toNumber(upload.data.image_height),
        sizes: Object.fromEntries(Object.entries(upload.data.sizes ?? {})
          .filter(([, size]) => size?.url)
          .map(([name, size]) => [name, HttpClient.toAbsoluteUrl(size.url) as string]))
      }));
  }

  private static parseVideo(embed: SpectrumRawEmbed | undefined): RSISpectrumVideo
  {
    const data = embed?.data;
    return {
      // `url` is sometimes broken (`https://www.youtube.com/undefined`), the player URL is reliable
      url: HttpClient.toAbsoluteUrl(data?.embed_src ?? data?.url),
      title: data?.title || undefined,
      provider: data?.provider_name || undefined,
      thumbnail: HttpClient.toAbsoluteUrl(data?.image || undefined)
    };
  }

  private static toNumber(value: number | string | undefined): number | undefined
  {
    const number = Number(value);
    return value == null || value === '' || isNaN(number) ? undefined : number;
  }
}
