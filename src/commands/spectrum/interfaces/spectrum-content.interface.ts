/**
 * Kind of a {@link RSISpectrumContentBlock}.
 *
 * @category Types/Spectrum
 */
export enum RSISpectrumContentType
{
  /** Paragraphs of text */
  Text = 'text',
  /** One or more uploaded images */
  Image = 'image',
  /** An embedded video */
  Video = 'video',
}

/**
 * A block of a Spectrum post: text, images or a video. Check `type` to know which one.
 *
 * @category Types/Spectrum
 *
 * @example
 * ```typescript
 * import { RSI, RSISpectrumContentType } from '@unofficial-star-citizen-api/rsi.js';
 *
 * const rsi = new RSI();
 * const thread = await rsi.spectrum.getThread('star-citizen-alpha-4-10-live-hotfix-central');
 *
 * for (const block of thread.content)
 *   if (block.type === RSISpectrumContentType.Image)
 *     console.log(block.images.map(image => image.url));
 * ```
 */
export type RSISpectrumContentBlock = RSISpectrumTextBlock | RSISpectrumImageBlock | RSISpectrumVideoBlock;

/**
 * Paragraphs of text in a Spectrum post.
 *
 * @category Types/Spectrum
 */
export interface RSISpectrumTextBlock
{
  /** Always {@link RSISpectrumContentType.Text} */
  type: RSISpectrumContentType.Text;
  /** Paragraphs, in reading order */
  paragraphs: RSISpectrumParagraph[];
}

/**
 * A paragraph of a Spectrum post: a line of text, a heading, a list item or a quote.
 *
 * @category Types/Spectrum
 */
export interface RSISpectrumParagraph
{
  /** Kind of paragraph: plain text, heading, list item, quote... */
  style: RSISpectrumParagraphStyle;
  /** Plain text of the paragraph */
  text: string;
  /** Nesting level of list items, `0` for top-level paragraphs */
  depth: number;
  /** Links in the paragraph */
  links: RSISpectrumLink[];
  /** Inline formatting (bold, italic, code...) applied to parts of the text */
  inlineStyles: RSISpectrumInlineStyle[];
}

/**
 * Kind of a {@link RSISpectrumParagraph}. These are the Draft.js block types Spectrum uses.
 *
 * @category Types/Spectrum
 */
export enum RSISpectrumParagraphStyle
{
  /** Plain paragraph */
  Unstyled = 'unstyled',
  /** Level 1 heading */
  HeaderOne = 'header-one',
  /** Level 2 heading */
  HeaderTwo = 'header-two',
  /** Level 3 heading */
  HeaderThree = 'header-three',
  /** Bulleted list item, see {@link RSISpectrumParagraph.depth} for nesting */
  UnorderedListItem = 'unordered-list-item',
  /** Numbered list item, see {@link RSISpectrumParagraph.depth} for nesting */
  OrderedListItem = 'ordered-list-item',
  /** Quote */
  Blockquote = 'blockquote',
  /** Code block */
  CodeBlock = 'code-block',
}

/**
 * A link inside a {@link RSISpectrumParagraph}.
 *
 * @category Types/Spectrum
 */
export interface RSISpectrumLink
{
  /** Linked text, as displayed in the paragraph */
  text: string;
  /** Absolute target URL */
  url: string;
}

/**
 * Inline formatting applied to part of a {@link RSISpectrumParagraph}.
 *
 * @category Types/Spectrum
 */
export interface RSISpectrumInlineStyle
{
  /** Index of the first formatted character in {@link RSISpectrumParagraph.text} */
  offset: number;
  /** Number of formatted characters */
  length: number;
  /** Formatting as reported by RSI, for example `BOLD`, `ITALIC`, `UNDERLINE` or `CODE` */
  style: string;
}

/**
 * Images uploaded in a Spectrum post.
 *
 * @category Types/Spectrum
 */
export interface RSISpectrumImageBlock
{
  /** Always {@link RSISpectrumContentType.Image} */
  type: RSISpectrumContentType.Image;
  /** Images, in display order */
  images: RSISpectrumImage[];
}

/**
 * An image uploaded to Spectrum.
 *
 * @category Types/Spectrum
 */
export interface RSISpectrumImage
{
  /** Absolute URL of the full-size image */
  url: string;
  /** Width of the full-size image, in pixels */
  width: number | undefined;
  /** Height of the full-size image, in pixels */
  height: number | undefined;
  /** Absolute URLs of the resized versions, by size name: `mini`, `square`, `small`, `medium`, `large` */
  sizes: Record<string, string>;
}

/**
 * A video embedded in a Spectrum post.
 *
 * @category Types/Spectrum
 */
export interface RSISpectrumVideoBlock
{
  /** Always {@link RSISpectrumContentType.Video} */
  type: RSISpectrumContentType.Video;
  /** The embedded video */
  video: RSISpectrumVideo;
}

/**
 * A video embedded in a Spectrum post, for example from YouTube.
 *
 * @category Types/Spectrum
 */
export interface RSISpectrumVideo
{
  /** Absolute URL of the embeddable player */
  url: string | undefined;
  /** Video title */
  title: string | undefined;
  /** Video host, for example `YouTube` */
  provider: string | undefined;
  /** Absolute URL of the video thumbnail */
  thumbnail: string | undefined;
}
