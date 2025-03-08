import { RSI } from '../src/index';
import { assertValidSchema } from './validator';

describe('Starmap', () => {
  test('should return systems data', async () => {
    const rsi = new RSI();
    const data = await rsi.starmap.findSystems('pyro');

    expect(data).not.toBeNull();
    assertValidSchema(data, 'starmap_systems.json');
  });

  test('should return search data', async () => {
    const rsi = new RSI();
    const data = await rsi.starmap.search('Stanton');

    expect(data).not.toBeNull();
    assertValidSchema(data, 'starmap_search.json');
  });

  test('should return celestial object data', async () => {
    const rsi = new RSI();
    const data = await rsi.starmap.findCelestialObjects('TOHIL.PLANETS.TOHILIII');

    expect(data).not.toBeNull();
    assertValidSchema(data, 'starmap_object.json');
  });

  test('should return star system data', async () => {
    const rsi = new RSI();
    const data = await rsi.starmap.findStarSystems('STANTON');

    expect(data).not.toBeNull();
    assertValidSchema(data, 'starmap_star_system.json');
  });

  test('should return tunnels data', async () => {
    const rsi = new RSI();
    const data = await rsi.starmap.findTunnels('1188')

    expect(data).not.toBeNull();
    assertValidSchema(data, 'starmap_tunnels.json');
  });

  test('should return species data', async () => {
    const rsi = new RSI();
    const data = await rsi.starmap.findSpecies();

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
      const rsi = new RSI();
      const data = await rsi.starmap.findRoutes(from, to, shipSize);

      expect(data).not.toBeNull();
      assertValidSchema(data, 'starmap_route_search.json');
    }
  );
});
