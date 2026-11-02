import { HttpClient } from '@/http-client';
import { PatchNote } from './version-patch-notes';
import { Roadmap } from './version-roadmap';
import { Spectrum } from './version-spectrum';

/**
 * Game versions per release channel (LIVE, PTU, ETF) and patch notes, from three sources.
 * Access it through {@link RSI.versions}.
 *
 * @category Versions
 *
 * @example
 * ```typescript
 * import { RSI } from '@unofficial-star-citizen-api/rsi.js';
 *
 * const rsi = new RSI();
 *
 * const versions = await rsi.versions.roadmap.getVersions(); // { live, ptu, etf }
 * const latest = await rsi.versions.patchNote.getLatest();
 * const ptu = await rsi.versions.spectrum.getPtu();
 * ```
 */
export class Versions
{
  /**
   * Versions announced in Spectrum patch-note threads, with PTU waves
   */
  public readonly spectrum: Spectrum;

  /**
   * Patch notes from the RSI patch notes page
   */
  public readonly patchNote: PatchNote;

  /**
   * Current LIVE, PTU and ETF versions announced on the RSI roadmap
   */
  public readonly roadmap: Roadmap;

  /** @hidden */
  constructor(httpClient: HttpClient)
  {
    this.spectrum = new Spectrum(httpClient);
    this.patchNote = new PatchNote(httpClient);
    this.roadmap = new Roadmap(httpClient);
  }
}
