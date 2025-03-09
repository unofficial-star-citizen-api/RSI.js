import { HttpClient } from 'src/http-client';
import { PatchNote } from './version-patch-notes';
import { Roadmap } from './version-roadmap';
import { Spectrum } from './version-spectrum';

export class Version
{
  /**
   * Get version from the Spectrum API
   */
  public readonly spectrum: Spectrum;

  /**
   * Get version from the Patch Note API
   */
  public readonly patchNote: PatchNote;

  /**
   * Get version from the Roadmap API
   */
  public readonly roadmap: Roadmap;

  constructor(httpClient: HttpClient)
  {
    this.spectrum = new Spectrum(httpClient);
    this.patchNote = new PatchNote(httpClient);
    this.roadmap = new Roadmap(httpClient);
  }
}