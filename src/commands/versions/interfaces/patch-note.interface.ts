import type { RSIResourceMeta } from '@/types/resource-meta.interface';

/**
 * A patch note from the RSI patch notes page, returned by {@link VersionsPatchNotes}.
 *
 * @category Types/Versions
 */
export interface RSIPatchNote
{
  /** Title of the patch note */
  title: string | undefined;
  /** Game version found in the title, for example `4.0.1` */
  version: string | undefined;
  /** Resource metadata; `meta.url` is the patch note page */
  meta: RSIResourceMeta;
  /** URL of the cover image */
  image: string | undefined;
  /** Number of comments */
  commentCount: number | undefined;
  /** Relative publication time as displayed by RSI, for example `2 days ago` */
  time_ago: string | undefined;
}
