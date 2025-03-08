import { HttpClient } from '../../http-client';
import { SpeciesInterface } from './interfaces/species.interface';
import { StarMapHelper } from './helpers/starmap.helper'

/**
 * StarmapSpecies class for retrieving Star Citizen starmap species
 */
export class StarmapSpecies {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public async find(name?: string): Promise<SpeciesInterface[] | null> {
    const species = await StarMapHelper.getStarmapData<SpeciesInterface>(this.httpClient,"species");
    if (species === null) {
      return null;
    }

    if (name === undefined) {
      return species;
    }

    const res = species.filter(s =>
      String(s.name).toLowerCase() === String(name).toLowerCase() ||
      String(s.code).toLowerCase() === String(name).toLowerCase()
    );

    return res.length > 0 ? res : null;
  }
}
