import { RSINotFoundError } from '@/errors';

/**
 * Thrown when no Spectrum thread exists for the requested slug.
 *
 * @category Errors
 *
 * @example
 * ```typescript
 * import { RSI, RSISpectrumThreadNotFoundError } from '@unofficial-star-citizen-api/rsi.js';
 *
 * const rsi = new RSI();
 *
 * try {
 *   await rsi.spectrum.getThread('this-thread-does-not-exist');
 * } catch (error) {
 *   if (error instanceof RSISpectrumThreadNotFoundError)
 *     console.log('No such thread');
 * }
 * ```
 */
export class RSISpectrumThreadNotFoundError extends RSINotFoundError
{
  /**
   * @param slug - The thread slug that was not found
   */
  constructor(slug: string)
  {
    super('Spectrum thread', slug);
    this.name = 'RSISpectrumThreadNotFoundError';
  }
}

/**
 * Thrown when no Spectrum channel exists for the requested ID.
 *
 * @category Errors
 *
 * @example
 * ```typescript
 * import { RSI, RSISpectrumChannelNotFoundError } from '@unofficial-star-citizen-api/rsi.js';
 *
 * const rsi = new RSI();
 *
 * try {
 *   await rsi.spectrum.getThreads(1234567890);
 * } catch (error) {
 *   if (error instanceof RSISpectrumChannelNotFoundError)
 *     console.log('No such channel');
 * }
 * ```
 */
export class RSISpectrumChannelNotFoundError extends RSINotFoundError
{
  /**
   * @param channelId - The channel ID that was not found
   */
  constructor(channelId: number)
  {
    super('Spectrum channel', channelId);
    this.name = 'RSISpectrumChannelNotFoundError';
  }
}

/**
 * Thrown when no Spectrum community exists for the requested ID.
 *
 * @category Errors
 *
 * @example
 * ```typescript
 * import { RSI, RSISpectrumCommunityNotFoundError } from '@unofficial-star-citizen-api/rsi.js';
 *
 * const rsi = new RSI();
 *
 * try {
 *   await rsi.spectrum.getChannels(999999);
 * } catch (error) {
 *   if (error instanceof RSISpectrumCommunityNotFoundError)
 *     console.log('No such community');
 * }
 * ```
 */
export class RSISpectrumCommunityNotFoundError extends RSINotFoundError
{
  /**
   * @param communityId - The community ID that was not found
   */
  constructor(communityId: number)
  {
    super('Spectrum community', communityId);
    this.name = 'RSISpectrumCommunityNotFoundError';
  }
}
