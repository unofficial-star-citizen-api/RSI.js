import type { RSIResourceMeta } from '@/types/resource-meta.interface';

export interface RSIPatchNote
{
  title: string | undefined;
  version: string | undefined;
  meta: RSIResourceMeta;
  image: string | undefined;
  commentCount: number | undefined;
  time_ago: string | undefined;
}