import { HttpClient } from 'src/http-client';
import { StarmapSearch } from './starmap-search';
import { StarmapRoute } from './starmap-routes';
import { StarmapCelestialObjects } from './starmap-celestial-objects';
import { StarmapAffiliations } from './starmap-affiliations';
import { StarmapSpecies } from './starmap-species';
import { StarmapStarSystems } from './starmap-star-systems';
import { StarmapTunnels } from './starmap-tunnels';
import { StarmapSystems } from './starmap-systems';

export class Starmap {
  public readonly search: StarmapSearch['find'];
  public readonly findAffilations: StarmapAffiliations['find'];
  public readonly findCelestialObjects: StarmapCelestialObjects['find'];
  public readonly findRoutes: StarmapRoute['find'];
  public readonly findSpecies: StarmapSpecies['find'];
  public readonly findStarSystems: StarmapStarSystems['find'];
  public readonly findSystems: StarmapSystems['find'];
  public readonly findTunnels: StarmapTunnels['find'];

  constructor(httpClient: HttpClient) {
    this.search = new StarmapSearch(httpClient).find;
    this.findAffilations = new StarmapAffiliations(httpClient).find;
    this.findCelestialObjects = new StarmapCelestialObjects(httpClient).find;
    this.findRoutes = new StarmapRoute(httpClient).find;
    this.findSpecies = new StarmapSpecies(httpClient).find;
    this.findStarSystems = new StarmapStarSystems(httpClient).find;
    this.findSystems = new StarmapSystems(httpClient).find;
    this.findTunnels = new StarmapTunnels(httpClient).find;
  }
}