import
{
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi
} from 'vitest';
import { Starmap } from '../src/commands/starmap/starmap';
import { HttpClient } from '../src/index';
import starmapRouteSchema from './schemas/starmap_route_search.json';
import starmapSpeciesSchema from './schemas/starmap_species.json';
import { assertValidSchema } from './utils/validator';

const BOOTUP_URL = 'https://robertsspaceindustries.com/api/starmap/bootup';
const FIND_URL = 'https://robertsspaceindustries.com/api/starmap/find';
const ROUTES_URL = 'https://robertsspaceindustries.com/api/starmap/routes/find';

const MOCK_SYSTEM = {
  id: '1',
  name: 'Pyro',
  code: 'PYRO',
  type: 'SINGLE_STAR',
  status: 'P',
  description: 'Pyro star system',
  affiliation: [{
    id: '2', code: 'OUTLAW', color: '#FF0000', name: 'Outlaws', membership_id: '2'
  }],
  aggregated_danger: 5,
  aggregated_economy: 1.0,
  aggregated_population: 0.2,
  aggregated_size: '1.5',
  info_url: null
};

const MOCK_STANTON_SYSTEM = {
  id: '2',
  name: 'Stanton',
  code: 'STANTON',
  type: 'SINGLE_STAR',
  status: 'P',
  description: 'Stanton star system',
  affiliation: [{
    id: '1', code: 'UEE', color: '#0000FF', name: 'UEE', membership_id: '1'
  }],
  aggregated_danger: 1,
  aggregated_economy: 3.0,
  aggregated_population: 3.5,
  aggregated_size: '2.0',
  info_url: null
};

const MOCK_TUNNEL = {
  id: '1188',
  direction: 'BIDIRECTIONAL',
  entry_id: '100',
  exit_id: '200',
  size: 'M',
  entry: {
    id: '100', code: 'STANTON.JUMPPOINTS.STANTONPYRO',
    designation: 'Pyro Jump Point',
    distance: '1000', latitude: '0.5', longitude: '0.5',
    star_system_id: '2', status: 'P', type: 'JUMPPOINT',
    star_system: {
      id: '2', name: 'Stanton', code: 'STANTON', status: 'P', type: 'SINGLE_STAR'
    }
  },
  exit: {
    id: '200', code: 'PYRO.JUMPPOINTS.PYROSTANTON',
    designation: 'Stanton Jump Point',
    distance: '2000', latitude: '1.0', longitude: '1.0',
    star_system_id: '1', status: 'P', type: 'JUMPPOINT',
    star_system: {
      id: '1', name: 'Pyro', code: 'PYRO', status: 'P', type: 'SINGLE_STAR'
    }
  }
};

const MOCK_SPECIES = {
  id: '1', code: 'UEE', name: 'UEE'
};

const MOCK_BOOTUP_RESPONSE = {
  success: 1,
  data: {
    systems: { resultset: [MOCK_SYSTEM, MOCK_STANTON_SYSTEM] },
    tunnels: { resultset: [MOCK_TUNNEL] },
    species: { resultset: [MOCK_SPECIES] }
  }
};

const MOCK_CELESTIAL_OBJECT = {
  id: '300',
  code: 'TOHIL.PLANETS.TOHILIII',
  designation: 'Tohil III',
  distance: '500',
  habitable: '0',
  parent_id: '10',
  longitude: '1.2',
  appearance: 'Gas',
  children: [],
  population: [],
  sensor_danger: '0',
  sensor_economy: '0',
  sensor_population: '0',
  show_label: '1',
  show_orbitlines: '1',
  size: 'L',
  affiliation: [{
    id: '1', code: 'UEE', color: '#0000FF', name: 'UEE', membership_id: '1'
  }],
  subtype: { id: '3', name: 'Gas Giant' }
};

const MOCK_STAR_SYSTEM_DETAIL = {
  id: '2',
  code: 'STANTON',
  name: 'Stanton',
  type: 'SINGLE_STAR',
  status: 'P',
  description: 'Stanton star system',
  affiliation: [{
    id: '1', code: 'UEE', color: '#0000FF', name: 'UEE', 'membership.id': '1'
  }],
  aggregated_danger: 1,
  aggregated_economy: 3,
  aggregated_population: 3,
  aggregated_size: '2',
  celestial_objects: []
};

const MOCK_ROUTE = {
  name: 'Lorville to Area 18',
  label: 'LORVILLE→AREA18',
  first_jump: null,
  flight_distance: 12345.6,
  jumps: 0,
  segments: [
    {
      id: '10',
      name: 'Lorville',
      type: 'LZ',
      system_id: '2',
      system_code: 'STANTON',
      object_id: '50',
      object_code: 'STANTON.LZS.LORVILLE',
      segment_type: 'DEPARTURE',
      segment_distance: null,
      is_departure: true,
      is_destination: false
    }
  ]
};

describe('Starmap', () =>
{
  let httpClient: HttpClient;
  let starmap: Starmap;

  beforeEach(() =>
  {
    httpClient = new HttpClient();
    starmap = new Starmap(httpClient);
  });

  afterEach(() =>
  {
    vi.restoreAllMocks();
  });

  describe('findSystems', () =>
  {
    test('should return systems matching the name', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200, data: MOCK_BOOTUP_RESPONSE
      } as any);

      const data = await starmap.findSystems('pyro');

      expect(data).not.toBeNull();
      expect(data).toHaveLength(1);
      expect(data![0].name).toBe('Pyro');
      expect(data![0].code).toBe('PYRO');
    });

    test('should return null when system not found', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200, data: MOCK_BOOTUP_RESPONSE
      } as any);

      const data = await starmap.findSystems('nonexistent');

      expect(data).toBeNull();
    });

    test('should return all systems when no name filter provided', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200, data: MOCK_BOOTUP_RESPONSE
      } as any);

      const data = await starmap.findSystems();

      expect(data).toHaveLength(2);
    });

    test('should return null on API failure', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200, data: { success: 0 }
      } as any);

      const data = await starmap.findSystems('pyro');

      expect(data).toBeNull();
    });

    test('should call bootup URL', async () =>
    {
      const spy = vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200, data: MOCK_BOOTUP_RESPONSE
      } as any);

      await starmap.findSystems('pyro');

      expect(spy).toHaveBeenCalledWith(BOOTUP_URL);
    });
  });

  describe('search', () =>
  {
    test('should return search results', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200,
        data: {
          success: 1,
          data: {
            systems: {
              resultset: [{
                id: '2', code: 'STANTON', name: 'Stanton', type: 'SINGLE_STAR'
              }]
            },
            objects: {
              resultset: [{
                id: '50', code: 'STANTON.LZS.LORVILLE', designation: 'Lorville', star_system_id: '2', status: 'P', type: 'LZ', star_system: {
                  id: '2', code: 'STANTON', name: 'Stanton', status: 'P', type: 'SINGLE_STAR'
                }
              }]
            }
          }
        }
      } as any);

      const data = await starmap.search('Stanton');

      expect(data).not.toBeNull();
      expect(data!.systems).toHaveLength(1);
      expect(data!.objects).toHaveLength(1);
    });

    test('should return null on API failure', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200, data: { success: 0 }
      } as any);

      const data = await starmap.search('Stanton');

      expect(data).toBeNull();
    });

    test('should call the find URL with the query', async () =>
    {
      const spy = vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200,
        data: { success: 1, data: { systems: { resultset: [] }, objects: { resultset: [] } } }
      } as any);

      await starmap.search('Stanton');

      expect(spy).toHaveBeenCalledWith(FIND_URL, { query: 'Stanton' });
    });
  });

  describe('findCelestialObjects', () =>
  {
    test('should return celestial object data', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200,
        data: { success: 1, data: { resultset: MOCK_CELESTIAL_OBJECT } }
      } as any);

      const data = await starmap.findCelestialObjects('TOHIL.PLANETS.TOHILIII');

      expect(data).not.toBeNull();
      expect((data as any).code).toBe('TOHIL.PLANETS.TOHILIII');
    });

    test('should return null on API failure', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200, data: { success: 0 }
      } as any);

      const data = await starmap.findCelestialObjects('INVALID');

      expect(data).toBeNull();
    });
  });

  describe('findStarSystems', () =>
  {
    test('should return star system detail', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200,
        data: { success: 1, data: { resultset: MOCK_STAR_SYSTEM_DETAIL } }
      } as any);

      const data = await starmap.findStarSystems('STANTON');

      expect(data).not.toBeNull();
      expect((data as any).code).toBe('STANTON');
    });

    test('should return null on non-200 response', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 404, data: null
      } as any);

      const data = await starmap.findStarSystems('INVALID');

      expect(data).toBeNull();
    });
  });

  describe('findTunnels', () =>
  {
    test('should return tunnels matching the id', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200, data: MOCK_BOOTUP_RESPONSE
      } as any);

      const data = await starmap.findTunnels('1188');

      expect(data).not.toBeNull();
      expect(data).toHaveLength(1);
      expect(data![0].id).toBe('1188');
    });

    test('should return null when tunnel not found', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200, data: MOCK_BOOTUP_RESPONSE
      } as any);

      const data = await starmap.findTunnels('9999');

      expect(data).toBeNull();
    });
  });

  describe('findSpecies', () =>
  {
    test('should return all species', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200, data: MOCK_BOOTUP_RESPONSE
      } as any);

      const data = await starmap.findSpecies();

      expect(data).not.toBeNull();
      expect(data).toHaveLength(1);
      expect(data![0].code).toBe('UEE');
      assertValidSchema(data, starmapSpeciesSchema);
    });

    test('should return null on API failure', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200, data: { success: 0 }
      } as any);

      const data = await starmap.findSpecies();

      expect(data).toBeNull();
    });
  });

  describe('findRoutes', () =>
  {
    test('should return route search results', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200,
        data: {
          success: 1,
          data: {
            shortest: MOCK_ROUTE,
            leastjumps: MOCK_ROUTE
          }
        }
      } as any);

      const data = await starmap.findRoutes('STANTON.LZS.LORVILLE', 'STANTON.LZS.AREA18', 'M');

      expect(data).not.toBeNull();
      expect(data!.shortest).toBeDefined();
      expect(data!.leastjumps).toBeDefined();
      assertValidSchema(data, starmapRouteSchema);
    });

    test('should call the routes URL with correct parameters', async () =>
    {
      const spy = vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200,
        data: { success: 1, data: { shortest: MOCK_ROUTE, leastjumps: MOCK_ROUTE } }
      } as any);

      await starmap.findRoutes('STANTON.LZS.LORVILLE', 'STANTON.LZS.AREA18', 'M');

      expect(spy).toHaveBeenCalledWith(ROUTES_URL, {
        departure: 'STANTON.LZS.LORVILLE',
        destination: 'STANTON.LZS.AREA18',
        ship_size: 'M'
      });
    });

    test('should return null on API failure', async () =>
    {
      vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 200, data: { success: 0 }
      } as any);

      const data = await starmap.findRoutes('A', 'B', 'M');

      expect(data).toBeNull();
    });
  });
});

