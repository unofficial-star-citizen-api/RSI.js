import { HttpClient } from '@/http-client';
import { getAll as getAllFunction } from './ship-get-all';
import { getByChassisId as getByChassisIdFunction } from './ship-get-by-chassis-id';
import { getById as getByIdFunction } from './ship-get-by-id';
import { search as searchFunction } from './ship-search';
import { RSIShipSearch, RSIShipSearchParams } from './interfaces';

/**
 * Ships of the RSI ship matrix, with full specs and current store prices.
 * Access it through {@link RSI.ships}.
 *
 * @category Commands
 * @hideconstructor
 * @see https://robertsspaceindustries.com/ship-matrix
 * @see https://robertsspaceindustries.com/pledge/ships
 */
export class Ships
{
  /**
   * Get a ship by its ship-matrix ID, with its specs and store price.
   *
   * Costs two requests: one to the ship matrix, one to the store for the price.
   *
   * @param id - Ship-matrix ID, for example `56` for the Cutlass Black
   * @returns The ship, or `null` when no ship has this ID
   * @throws {@link RSIError} if `id` is not a positive integer, or the ship matrix or the store cannot be retrieved
   *
   * @example
   * ```typescript
   * import { RSI } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   *
   * const ship = await rsi.ships.getById(56);
   * console.log(ship?.name, ship?.price); // Cutlass Black 110
   * ```
   */
  public readonly getById: (id: number) => Promise<RSIShipSearch | null>;

  /**
   * Get every variant of a ship chassis, for example all Cutlass variants, with specs and store prices.
   *
   * Costs two requests: one to the ship matrix, one to the store for the prices.
   *
   * @param chassisId - Chassis ID, as found in {@link RSIShipSearch.chassis_id}
   * @returns The ships sharing this chassis; empty when no ship has this chassis ID
   * @throws {@link RSIError} if `chassisId` is not a positive integer, or the ship matrix or the store cannot be retrieved
   *
   * @example
   * ```typescript
   * import { RSI } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   *
   * const cutlass = await rsi.ships.getById(56);
   * const variants = await rsi.ships.getByChassisId(cutlass!.chassis_id);
   * console.log(variants.map(ship => ship.name)); // ['Cutlass Black', 'Cutlass Red', ...]
   * ```
   */
  public readonly getByChassisId: (chassisId: number) => Promise<RSIShipSearch[]>;

  /**
   * Get every ship of the ship matrix, with specs and store prices.
   *
   * Reads the whole ship matrix in one request (several MB), and the store prices
   * in pages of 30, fetched in batches of 5.
   * Prefer {@link Ships.getById} or {@link Ships.search} when you only need a few ships.
   *
   * @returns All ships, in ship-matrix order
   * @throws {@link RSIError} if the ship matrix or the store cannot be retrieved
   *
   * @example
   * ```typescript
   * import { RSI } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   *
   * const ships = await rsi.ships.getAll();
   * const forSale = ships.filter(ship => ship.purchasable);
   * console.log(`${forSale.length} of ${ships.length} ships are for sale`);
   * ```
   */
  public readonly getAll: () => Promise<RSIShipSearch[]>;

  /**
   * Search the RSI store for ships, then fetch each match's ship-matrix specs and store price.
   *
   * Store pages from `page` to `page_max` are read in batches of 5, stopping at the first empty page.
   * Each matched ship then costs one extra request for its specs, run with a concurrency of 5,
   * plus one request per distinct chassis for the prices.
   * Keep `page_max` small, or use {@link Ships.getAll}, when you scan the whole store.
   *
   * @param searchArgs - Filters and page range; pass `{}` to read the first store page
   * @returns The matching ships
   * @throws {@link RSIError} if a store page, the ship matrix or the store prices cannot be retrieved
   *
   * @example
   * ```typescript
   * import { RSI, RSIShipClassification, RSIShipSize } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   *
   * // Ships matching a name
   * const cutlasses = await rsi.ships.search({ name: 'Cutlass' });
   * console.log(cutlasses.map(ship => `${ship.name}: $${ship.price}`));
   *
   * // Large transport ships, walking up to 5 store pages
   * const freighters = await rsi.ships.search({
   *   classification: RSIShipClassification.Transport,
   *   size: RSIShipSize.Large,
   *   page_max: 5,
   * });
   * ```
   */
  public readonly search: (searchArgs: RSIShipSearchParams) => Promise<RSIShipSearch[]>;

  /** @hidden */
  constructor(httpClient: HttpClient)
  {
    this.getById = getByIdFunction(httpClient, Ships.name);
    this.getByChassisId = getByChassisIdFunction(httpClient, Ships.name);
    this.getAll = getAllFunction(httpClient, Ships.name);
    this.search = searchFunction(httpClient, Ships.name);
  }
}
