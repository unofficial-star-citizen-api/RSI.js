export * from './celestial-object.interface';
export * from './route.interface';
export * from './star-system.interface';
export * from './system.interface';

/**
 * Ship size for {@link Starmaps.findRoutes}. It decides which jump tunnels a route can use.
 *
 * @category Types/Starmaps
 */
export enum RSIStarmapRouteShipSize
{
  Small = 'S',
  Medium = 'M',
  Large = 'L'
}

/** @internal */
export interface RSIStarMapObject
{
  success: number;
  code: string;
  msg: string;
  data: RSIStarMapObjectData;
}

/** @internal */
export interface RSIStarMapObjectData
{
  config: RSIStarMapObjectConfig;
  systems: RSIStarMapObjectSystems;
  tunnels: RSIStarMapObjectTunnels;
  species: RSIStarMapObjectAffiliations;
  affiliations: RSIStarMapObjectAffiliations;
}

/** @internal */
export interface RSIStarMapObjectAffiliations
{
  rowcount: number;
  pagecount: null | number;
  startrow: number;
  resultset: RSIStarMapObjectAffiliation[];
  totalrows: number;
  pagesize: number;
  page: number;
  offset: number;
  estimatedrows: boolean;
}

/**
 * A political affiliation (UEE, Banu, Xi'an...), returned by {@link Starmaps.getAffiliations}.
 *
 * @category Types/Starmaps
 */
export interface RSIStarMapObjectAffiliation
{
  id: number;
  code: string;
  color?: string;
  name: string;
  'membership.id'?: number;
}

/**
 * A species, returned by {@link Starmaps.getSpecies}.
 *
 * @category Types/Starmaps
 */
export interface RSIStarMapObjectSpecies
{
  id: number;
  code: string;
  color?: string;
  name: string;
  'membership.id'?: number;
}

/** @internal */
export interface RSIStarMapObjectConfig
{
  nearPlane: number;
  farPlane: number;
  stars: RSIStarMapObjectStars;
  routes: RSIStarMapObjectRoute[];
  starfield: RSIStarMapObjectStarfield;
  longRangeScanner: RSIStarMapObjectLongRangeScanner;
}

/**
 * Starmap renderer settings. Not returned by any method.
 * @hidden
 *
 * @category Types/Starmaps
 */
export interface RSIStarMapObjectLongRangeScanner
{
  radius: number;
  colorD1: string;
  colorD2: string;
  colorL1: string;
  colorL2: string;
  colorC1: string;
  colorC2: string;
  colorBorder: string;
  colorGlow: string;
  colorMap: string;
  alpha: number;
  radiusD: number;
  widthD: number;
  ratioD: number;
  radiusL: number;
  widthL: number;
  ratioL: number;
  radiusC: number;
  widthC: number;
  ratioC: number;
  radiusBorder: number;
  widthBorder: number;
  tickCount: number;
  tickLength: number;
  tickWidth: number;
  glowWidth: number;
}

/**
 * Starmap renderer settings. Not returned by any method.
 * @hidden
 *
 * @category Types/Starmaps
 */
export interface RSIStarMapObjectRoute
{
  width: number;
  color: string;
  colorBorder: string;
  size: number;
  density: number;
  speed: number;
  side: number;
  center: number;
  pitchEffect: number;
  pitchIntensity: number;
  highlightFactor: number;
  depthFactor: number;
}

/**
 * Starmap renderer settings. Not returned by any method.
 * @hidden
 *
 * @category Types/Starmaps
 */
export interface RSIStarMapObjectStarfield
{
  radius: number;
  count: number;
  sizeMin: number;
  sizeMax: number;
  color1: string;
  color2: string;
}

/**
 * Starmap renderer settings. Not returned by any method.
 * @hidden
 *
 * @category Types/Starmaps
 */
export interface RSIStarMapObjectStars
{
  useStarFading: boolean;
  fadeStart: number;
  pitchEffect: number;
  pitchIntensity: number;
  radiusFactor: number;
  maxRadius: number;
  colorD1: string;
  colorD2: string;
  colorL1: string;
  colorL2: string;
  colorC1: string;
  colorC2: string;
}

/** @internal */
export interface RSIStarMapObjectSystems
{
  rowcount: number;
  pagecount: null | number;
  startrow: number;
  resultset: RSIStarMapObjectSystem[];
  totalrows: number;
  pagesize: number;
  page: number;
  offset: number;
  estimatedrows: boolean;
}

/**
 * A star system, returned by {@link Starmaps.getSystems}. Positions are starmap coordinates.
 *
 * @category Types/Starmaps
 */
export interface RSIStarMapObjectSystem
{
  id: number;
  code: string;
  description: string;
  info_url: null | string;
  name: string;
  position_x: number;
  position_y: number;
  position_z: number;
  status: string;
  time_modified: string;
  type: string;
  affiliation: RSIStarMapObjectAffiliation[];
  aggregated_size: string;
  aggregated_population: number;
  aggregated_economy: number;
  aggregated_danger: number;
  thumbnail?: RSIStarMapObjectThumbnail;
}

/**
 * Thumbnail image of a star system.
 *
 * @category Types/Starmaps
 */
export interface RSIStarMapObjectThumbnail
{
  slug: string;
  source: string;
  images: unknown[] | RSIStarMapObjectImagesClass;
}

/**
 * Image URLs of a thumbnail, keyed by RSI image format.
 *
 * @category Types/Starmaps
 */
export interface RSIStarMapObjectImagesClass
{
  post: string;
  product_thumb_large: string;
  subscribers_vault_thumbnail: string;
}

/** @internal */
export interface RSIStarMapObjectTunnels
{
  rowcount: number;
  pagecount: null | number;
  startrow: number;
  resultset: RSIStarMapObjectTunnel[];
  totalrows: number;
  pagesize: number;
  page: number;
  offset: number;
  estimatedrows: boolean;
}

/**
 * A jump tunnel between two jump points, returned by {@link Starmaps.getTunnels}.
 *
 * @category Types/Starmaps
 */
export interface RSIStarMapObjectTunnel
{
  id: number;
  direction: string;
  entry_id: number;
  exit_id: number;
  name: null | string;
  size: RSIStarMapObjectSize;
  entry: RSIStarMapObjectEntry;
  exit: RSIStarMapObjectEntry;
}

/**
 * Entry or exit jump point of a tunnel.
 *
 * @category Types/Starmaps
 */
export interface RSIStarMapObjectEntry
{
  id: number;
  code: string;
  designation: string;
  distance: number;
  latitude: number | null;
  longitude: number;
  name: null | string;
  star_system_id: number;
  status: string;
  type: string;
}

/**
 * Jump tunnel size: small, medium or large.
 *
 * @category Types/Starmaps
 */
export enum RSIStarMapObjectSize
{
  L = 'L',
  M = 'M',
  S = 'S',
}
