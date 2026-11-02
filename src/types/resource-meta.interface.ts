/**
 * Metadata shared by every parsed resource, exposed as its `meta` property.
 *
 * @category Client
 *
 * @example
 * ```typescript
 * const profile = await rsi.users.getProfile('Dymerz');
 * console.log(profile?.meta.url); // https://robertsspaceindustries.com/citizens/Dymerz
 * ```
 */
export interface RSIResourceMeta
{
  /** Absolute URL of the resource's public RSI web page, or `undefined` when it has none */
  url: string | undefined;
}
