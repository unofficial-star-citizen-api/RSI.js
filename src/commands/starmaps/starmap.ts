import { HttpClient } from '@/http-client';
import { StarmapAffiliations } from './starmap-affiliations';
import { StarmapCelestialObjects } from './starmap-celestial-objects';
import { StarmapRoute } from './starmap-routes';
import { StarmapSearch } from './starmap-search';
import { StarmapSpecies } from './starmap-species';
import { StarmapStarSystems } from './starmap-star-systems';
import { StarmapSystems } from './starmap-systems';
import { StarmapTunnels } from './starmap-tunnels';

export class Starmaps
{
  public readonly search: StarmapSearch['find'];
  public readonly findAffilations: StarmapAffiliations['find'];
  public readonly findCelestialObjects: StarmapCelestialObjects['find'];
  public readonly findRoutes: StarmapRoute['find'];
  public readonly findSpecies: StarmapSpecies['find'];
  public readonly findStarSystems: StarmapStarSystems['find'];
  public readonly findSystems: StarmapSystems['find'];
  public readonly findTunnels: StarmapTunnels['find'];

  constructor(httpClient: HttpClient)
  {
    const starmapSearch = new StarmapSearch(httpClient);
    this.search = starmapSearch.find.bind(starmapSearch);

    const starmapAffiliations = new StarmapAffiliations(httpClient);
    this.findAffilations = starmapAffiliations.find.bind(starmapAffiliations);

    const starmapCelestialObjects = new StarmapCelestialObjects(httpClient);
    this.findCelestialObjects = starmapCelestialObjects.find.bind(starmapCelestialObjects);

    const starmapRoute = new StarmapRoute(httpClient);
    this.findRoutes = starmapRoute.find.bind(starmapRoute);

    const starmapSpecies = new StarmapSpecies(httpClient);
    this.findSpecies = starmapSpecies.find.bind(starmapSpecies);

    const starmapStarSystems = new StarmapStarSystems(httpClient);
    this.findStarSystems = starmapStarSystems.find.bind(starmapStarSystems);

    const starmapSystems = new StarmapSystems(httpClient);
    this.findSystems = starmapSystems.find.bind(starmapSystems);

    const starmapTunnels = new StarmapTunnels(httpClient);
    this.findTunnels = starmapTunnels.find.bind(starmapTunnels);
  }
}