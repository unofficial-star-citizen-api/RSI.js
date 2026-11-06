import { HttpClient } from '@/http-client';
import {
  RSIStarmapCelestialObject,
  RSIStarmapRoute,
  RSIStarmapRouteShipSize,
  RSIStarMapObjectAffiliation,
  RSIStarMapObjectSpecies,
  RSIStarMapObjectSystem,
  RSIStarMapObjectTunnel,
  RSIStarMapSearch,
  RSIStarMapStarSystem
} from './interfaces';
import { StarmapAffiliations } from './starmap-affiliations';
import { StarmapCelestialObjects } from './starmap-celestial-objects';
import { StarmapRoute } from './starmap-routes';
import { StarmapSearch } from './starmap-search';
import { StarmapSpecies } from './starmap-species';
import { StarmapStarSystems } from './starmap-star-systems';
import { StarmapSystems } from './starmap-systems';
import { StarmapTunnels } from './starmap-tunnels';

/**
 * ARK Starmap data: star systems, celestial objects, jump tunnels, species, affiliations and routes.
 * Access it through {@link RSI.starmaps}.
 *
 * Field names in the results are kept as returned by the starmap API (snake_case).
 *
 * @category Commands
 * @hideconstructor
 * @see https://robertsspaceindustries.com/starmap
 */
export class Starmaps
{
  /**
   * Search star systems and celestial objects by name or code.
   *
   * @param searchPattern - Text to look for, for example `Stanton`
   * @returns Matching systems and objects
   * @throws {@link RSIError} if RSI answers with a non-200 status or rejects the search
   *
   * @example
   * ```typescript
   * import { RSI } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   * const result = await rsi.starmaps.search('Stanton');
   *
   * console.log(result?.systems.map(system => system.code));
   * console.log(result?.objects.map(object => object.designation));
   * ```
   */
  public readonly search: (searchPattern: string) => Promise<RSIStarMapSearch | null>;

  /**
   * Find the shortest route and the route with the fewest jumps between two locations.
   *
   * @param from - Code of the departure location, for example `STANTON.LZS.LORVILLE`
   * @param to - Code of the destination, for example `STANTON.LZS.AREA18`
   * @param shipSize - Ship size, which decides the jump tunnels the route can use
   * @returns Both routes, each with its distance, jump count and segments
   * @throws {@link RSIError} if RSI answers with a non-200 status or finds no route
   *
   * @example
   * ```typescript
   * import { RSI, RSIStarmapRouteShipSize } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   * const routes = await rsi.starmaps.findRoutes('STANTON.LZS.LORVILLE', 'STANTON.LZS.AREA18', RSIStarmapRouteShipSize.Medium);
   *
   * console.log(routes?.shortest.flight_distance, routes?.leastjumps.jumps);
   * ```
   */
  public readonly findRoutes: (from: string, to: string, shipSize: RSIStarmapRouteShipSize) => Promise<RSIStarmapRoute | null>;

  /**
   * Get every celestial object (planets, moons, stations, asteroid belts...).
   *
   * @returns All celestial objects
   * @throws {@link RSIError} if RSI answers with a non-200 status or an unsuccessful payload
   *
   * @example
   * ```typescript
   * import { RSI } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   * const objects = await rsi.starmaps.getAllCelestialObject();
   *
   * console.log(objects?.length, objects?.[0].code); // for example TOHIL.PLANETS.TOHILIII
   * ```
   */
  public readonly getAllCelestialObject: () => Promise<RSIStarmapCelestialObject[] | null>;

  /**
   * Get a single celestial object, with its children (moons, stations...).
   *
   * @param objectCode - Code of the object, for example `TOHIL.PLANETS.TOHILIII`
   * @returns The celestial object
   * @throws {@link RSICelestialObjectNotFoundError} if no celestial object has this code
   * @throws {@link RSIError} if RSI answers with a non-200 status or an unsuccessful payload
   *
   * @example
   * ```typescript
   * import { RSI } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   * const planet = await rsi.starmaps.getCelestialObjectByCode('TOHIL.PLANETS.TOHILIII');
   *
   * console.log(planet.designation, planet.habitable, planet.children.length);
   * ```
   */
  public readonly getCelestialObjectByCode: (objectCode: string) => Promise<RSIStarmapCelestialObject>;

  /**
   * Get a single star system, with its celestial objects.
   *
   * @param code - Code of the star system, for example `STANTON`
   * @returns The star system
   * @throws {@link RSIStarSystemNotFoundError} if no star system has this code
   * @throws {@link RSIError} if RSI answers with a non-200 status or an unsuccessful payload
   *
   * @example
   * ```typescript
   * import { RSI } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   * const stanton = await rsi.starmaps.getStarSystemByCode('STANTON');
   *
   * console.log(stanton.name, stanton.celestial_objects.length);
   * ```
   */
  public readonly getStarSystemByCode: (code: string) => Promise<RSIStarMapStarSystem>;

  /**
   * Get every star system.
   *
   * @returns All star systems
   * @throws {@link RSIError} if RSI answers with a non-200 status or an unsuccessful payload
   *
   * @example
   * ```typescript
   * import { RSI } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   * const systems = await rsi.starmaps.getSystems();
   *
   * console.log(systems?.map(system => `${system.code}: ${system.status}`));
   * ```
   */
  public readonly getSystems: () => Promise<RSIStarMapObjectSystem[] | null>;

  /**
   * Get political affiliations, optionally filtered by name or code.
   *
   * @param name - Exact name or code to keep, for example `UEE`; omit to get every affiliation
   * @returns The affiliations, or `null` if none matches `name`
   * @throws {@link RSIError} if the starmap data cannot be retrieved
   *
   * @example
   * ```typescript
   * import { RSI } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   * const all = await rsi.starmaps.getAffiliations();
   * const uee = await rsi.starmaps.getAffiliations('UEE');
   *
   * console.log(all?.length, uee?.[0].color);
   * ```
   */
  public readonly getAffiliations: (name?: string) => Promise<RSIStarMapObjectAffiliation[] | null>;

  /**
   * Get every species.
   *
   * @returns All species
   * @throws {@link RSIError} if RSI answers with a non-200 status or an unsuccessful payload
   *
   * @example
   * ```typescript
   * import { RSI } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   * const species = await rsi.starmaps.getSpecies();
   *
   * console.log(species?.map(s => s.name));
   * ```
   */
  public readonly getSpecies: () => Promise<RSIStarMapObjectSpecies[] | null>;

  /**
   * Get every jump tunnel, with its entry and exit points.
   *
   * @returns All jump tunnels
   * @throws {@link RSIError} if RSI answers with a non-200 status or an unsuccessful payload
   *
   * @example
   * ```typescript
   * import { RSI } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   * const tunnels = await rsi.starmaps.getTunnels();
   *
   * console.log(tunnels?.map(tunnel => `${tunnel.entry.code} -> ${tunnel.exit.code} (${tunnel.size})`));
   * ```
   */
  public readonly getTunnels: () => Promise<RSIStarMapObjectTunnel[] | null>;

  /** @hidden */
  constructor(httpClient: HttpClient)
  {
    const starmapSearch = new StarmapSearch(httpClient);
    this.search = starmapSearch.search.bind(starmapSearch);

    const starmapRoute = new StarmapRoute(httpClient);
    this.findRoutes = starmapRoute.findRoutes.bind(starmapRoute);

    const starmapCelestialObjects = new StarmapCelestialObjects(httpClient);
    this.getAllCelestialObject = starmapCelestialObjects.getAll.bind(starmapCelestialObjects);
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
