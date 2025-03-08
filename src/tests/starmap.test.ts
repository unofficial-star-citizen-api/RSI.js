import {
  StarmapSystems,
  StarmapSearch,
  StarmapCelestialObjects,
  StarmapStarSystems,
  StarmapTunnels,
  StarmapSpecies,
  StarmapRouteSearch
} from '../index';
import { assertValidSchema } from './validator';

describe('Starmap', () => {
  test('should return systems data', async () => {
    const systems = new StarmapSystems('pyro');
    const data = await systems.execute();

    expect(data).not.toBeNull();
    assertValidSchema(data, 'starmap_systems.json');
  });

  test('should return search data', async () => {
    const search = new StarmapSearch('Stanton');
    const data = await search.execute();

    expect(data).not.toBeNull();
    assertValidSchema(data, 'starmap_search.json');
  });

  test('should return celestial object data', async () => {
    const celestialObject = new StarmapCelestialObjects('TOHIL.PLANETS.TOHILIII');
    const data = await celestialObject.execute();

    expect(data).not.toBeNull();
    assertValidSchema(data, 'starmap_object.json');
  });

  test('should return star system data', async () => {
    const starSystem = new StarmapStarSystems('STANTON');
    const data = await starSystem.execute();

    expect(data).not.toBeNull();
    assertValidSchema(data, 'starmap_star_system.json');
  });

  test('should return tunnels data', async () => {
    const tunnels = new StarmapTunnels('1188');
    const data = await tunnels.execute();

    expect(data).not.toBeNull();
    assertValidSchema(data, 'starmap_tunnels.json');
  });

  test('should return species data', async () => {
    const species = new StarmapSpecies();
    const data = await species.execute();

    expect(data).not.toBeNull();
    assertValidSchema(data, 'starmap_species.json');
  });

  test.each([
    ['STANTON.LZS.LORVILLE', 'STANTON.LZS.AREA18', 'M'],
    ['STANTON.LZS.LORVILLE', 'STANTON.LZS.AREA18', 'L'],
    ['STANTON.LZS.LORVILLE', 'STANTON.LZS.AREA18', 'S'],
    ['SOL.PLANETS.EARTH', 'PYRO.PLANETS.PYROI', 'L'],
    ['ORION.PLANET.ORIONIIIARMITAGE', 'AYRKA.PLANET.AYRKAII', 'S']
  ])('should return route search data from %s to %s with ship size %s',
    async (from, to, shipSize) => {
      const routeSearch = new StarmapRouteSearch(from, to, shipSize);
      const data = await routeSearch.execute();

      expect(data).not.toBeNull();
      assertValidSchema(data, 'starmap_route_search.json');
    }
  );
});
