/**
 * Routes between two locations, returned by {@link Starmaps.findRoutes}.
 *
 * @category Starmaps
 */
export interface RSIStarmapRoute
{
  /** Route with the shortest flight distance */
  shortest: RSIStarmapRouteShortest;
  /** Route with the fewest jumps */
  leastjumps: RSIStarmapRouteLeastJumps;
}

/**
 * The route with the shortest flight distance.
 *
 * @category Starmaps
 */
export interface RSIStarmapRouteShortest
{
  /** Route name */
  name: string;
  /** Human-readable label */
  label: string;
  /** Name of the first jump point on the route */
  first_jump: string;
  /** Total flight distance, as computed by the starmap */
  flight_distance: number;
  /** Number of jumps */
  jumps: number;
  /** Steps of the route, from departure to destination */
  segments: RSIStarmapRouteSegment[];
}

/**
 * One step of a route: departure, travel, jump or destination.
 *
 * @category Starmaps
 */
export interface RSIStarmapRouteSegment
{
  /** Identifier of the location */
  id: number | string;
  /** Name of the location */
  name: string;
  /** Type of the location, for example a planet or jump point */
  type: string;
  /** Identifier of the star system */
  system_id: number;
  /** Code of the star system, for example `STANTON` */
  system_code: string;
  /** Identifier of the celestial object, if the location is one */
  object_id?: number;
  /** Code of the celestial object, for example `STANTON.LZS.LORVILLE` */
  object_code?: string;
  /** Kind of step, for example travel or jump */
  segment_type: string;
  /** Distance covered by this step */
  segment_distance?: number;
  /** `1` for the departure step, otherwise `false` */
  is_departure: 1 | false;
  /** `1` for the destination step, otherwise `false` */
  is_destination: 1 | false;
}

/**
 * The route with the fewest jumps.
 *
 * @category Starmaps
 */
export interface RSIStarmapRouteLeastJumps
{
  /** Route name */
  name: string;
  /** Human-readable label */
  label: string;
  /** Name of the first jump point on the route */
  first_jump: string;
  /** Total flight distance, as computed by the starmap */
  flight_distance: number;
  /** Number of jumps */
  jumps: number;
  /** Steps of the route, from departure to destination */
  segments: RSIStarmapRouteSegment[];
}
