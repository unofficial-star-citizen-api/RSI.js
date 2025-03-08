import { HttpClient } from 'src/http-client'
import { StarmapSearch } from './starmap-search'
import { StarmapRouteSearch } from './starmap-routes'
import { StarmapCelestialObjects } from './starmap-celestial-objects'
import { StarmapAffiliations } from './starmap-affiliations'
import { StarmapSpecies } from './starmap-species'
import { StarmapStarSystems } from './starmap-star-systems'
import { StarmapTunnels } from './starmap-tunnels'

export class Starmap {
  public readonly affilations: StarmapAffiliations;
  public readonly celestialObjects: StarmapCelestialObjects;
  public readonly routeSearch: StarmapRouteSearch;
  public readonly search: StarmapSearch;
  public readonly species: StarmapSpecies;
  public readonly starSystems: StarmapStarSystems;
  public readonly tunnel: StarmapTunnels;

  constructor(httpClient: HttpClient) {
    this.affilations = new StarmapAffiliations(httpClient);
    this.celestialObjects = new StarmapCelestialObjects(httpClient);
    this.routeSearch = new StarmapRouteSearch(httpClient);
    this.search = new StarmapSearch(httpClient);
    this.species = new StarmapSpecies(httpClient);
    this.starSystems = new StarmapStarSystems(httpClient);
    this.tunnel = new StarmapTunnels(httpClient);

  }
}