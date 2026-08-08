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
  public readonly search: StarmapSearch['search'];
  public readonly findRoutes: StarmapRoute['findRoutes'];

  public readonly getCelestialObjectByCode: StarmapCelestialObjects['getByCode'];
  public readonly getStarSystemByCode: StarmapStarSystems['getByCode'];

  public readonly getAffiliations: StarmapAffiliations['getAll'];
  public readonly getSpecies: StarmapSpecies['getAll'];
  public readonly getSystems: StarmapSystems['getAll'];
  public readonly getTunnels: StarmapTunnels['getAll'];

  constructor(httpClient: HttpClient)
  {
    const starmapSearch = new StarmapSearch(httpClient);
    this.search = starmapSearch.search.bind(starmapSearch);

    const starmapRoute = new StarmapRoute(httpClient);
    this.findRoutes = starmapRoute.findRoutes.bind(starmapRoute);

    const starmapCelestialObjects = new StarmapCelestialObjects(httpClient);
    this.getCelestialObjectByCode = starmapCelestialObjects.getByCode.bind(starmapCelestialObjects);

    const starmapStarSystems = new StarmapStarSystems(httpClient);
    this.getStarSystemByCode = starmapStarSystems.getByCode.bind(starmapStarSystems);

    const starmapAffiliations = new StarmapAffiliations(httpClient);
    this.getAffiliations = starmapAffiliations.getAll.bind(starmapAffiliations);

    const starmapSpecies = new StarmapSpecies(httpClient);
    this.getSpecies = starmapSpecies.getAll.bind(starmapSpecies);

    const starmapSystems = new StarmapSystems(httpClient);
    this.getSystems = starmapSystems.getAll.bind(starmapSystems);

    const starmapTunnels = new StarmapTunnels(httpClient);
    this.getTunnels = starmapTunnels.getAll.bind(starmapTunnels);
  }
}