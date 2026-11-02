/** @internal */
export interface RSIStarMapStarSystemResponse
{
  success: number;
  code: string;
  msg: string;
  data: RSIStarMapStarSystemData;
}

/** @internal */
export interface RSIStarMapStarSystemData
{
  rowcount: number;
  pagecount: null | number;
  startrow: number;
  resultset: RSIStarMapStarSystem[];
  totalrows: number;
  pagesize: number;
  page: number;
  offset: number;
  estimatedrows: boolean;
}

/**
 * A star system with its celestial objects, returned by {@link Starmaps.getStarSystemByCode}.
 *
 * Field names are kept as returned by the starmap API (snake_case).
 *
 * @category Starmaps
 */
export interface RSIStarMapStarSystem
{
  id: number;
  code: string;
  description: string;
  frost_line: number;
  habitable_zone_inner: number;
  habitable_zone_outer: number;
  info_url: null | string;
  name: string;
  position_x: number;
  position_y: number;
  position_z: number;
  shader_data: RSIStarMapStarSystemShaderData;
  status: string;
  time_modified: string;
  type: string;
  affiliation: RSIStarMapStarSystemAffiliation[];
  celestial_objects: RSIStarMapStarSystemCelestialObject[];
  aggregated_size: string;
  aggregated_population: number;
  aggregated_economy: number;
  aggregated_danger: number;
  thumbnail: RSIStarMapStarSystemThumbnail;
}

/**
 * Political affiliation of a star system.
 *
 * @category Starmaps
 */
export interface RSIStarMapStarSystemAffiliation
{
  id: number;
  code: string;
  color: string;
  name: string;
  'membership.id': number;
}

/**
 * A celestial object of a star system.
 *
 * @category Starmaps
 */
export interface RSIStarMapStarSystemCelestialObject
{
  id: number;
  age: number | null;
  appearance: string | null;
  axial_tilt: number | null;
  code: string;
  description: null | string;
  designation: string;
  distance: number | null;
  fairchanceact: boolean | null;
  habitable: boolean | null;
  info_url: null | string;
  latitude: number | null;
  longitude: number | null;
  name: null | string;
  orbit_period: number | null;
  parent_id: number | null;
  sensor_danger: string;
  sensor_economy: string;
  sensor_population: string;
  shader_data: RSIStarMapStarSystemCelestialObjectShaderData | null;
  show_label: boolean | null;
  show_orbitlines: boolean | null;
  size: number | null;
  subtype_id: number | null;
  time_modified: string;
  type: string;
  subtype: RSIStarMapStarSystemSubtype | null;
  affiliation: RSIStarMapStarSystemAffiliation[];
  population: unknown[];
  texture?: RSIStarMapStarSystemThumbnail;
  thumbnail?: RSIStarMapStarSystemThumbnail;
  model?: RSIStarMapStarSystemModel;
}

/**
 * 3D model settings of a celestial object.
 *
 * @category Starmaps
 */
export interface RSIStarMapStarSystemModel
{
  slug: string;
  source: string;
  images: unknown[];
}

/**
 * Rendering data of a celestial object.
 *
 * @category Starmaps
 */
export interface RSIStarMapStarSystemCelestialObjectShaderData
{
  sun?: RSIStarMapStarSystemSun;
  orbitalMin: number;
  orbitalMax: number;
  orbitalFactor: number;
  radius: number;
  fullturn?: number;
  highlight?: RSIStarMapStarSystemHighlight;
}

/**
 * Highlight colors used by the starmap renderer.
 *
 * @category Starmaps
 */
export interface RSIStarMapStarSystemHighlight
{
  color1: string;
  color2: string;
  alpha: number;
  atmosphere1: number;
  atmosphere2: number;
  atmosphere3: number;
  scaleMin: number;
  scaleMax: number;
  scalePeriod: number;
}

/**
 * Star rendering data.
 *
 * @category Starmaps
 */
export interface RSIStarMapStarSystemSun
{
  color1: string;
  color2: string;
  flare1: number;
  flare2: number;
  flare3: number;
  flare4: number;
  flare5: number;
  flare6: number;
  sphere: number;
  texture: number;
  corona: number;
  glow: number;
  alpha: number;
  rotation1: number;
  rotation2: number;
  map: number | string;
  iterations: number;
  scaleMin: number;
  scaleMax: number;
  scalePeriod: number;
}

/**
 * Subtype of a celestial object, for example a planet type.
 *
 * @category Starmaps
 */
export interface RSIStarMapStarSystemSubtype
{
  id: number;
  name: string;
  type: string;
}

/**
 * Thumbnail image of a star system.
 *
 * @category Starmaps
 */
export interface RSIStarMapStarSystemThumbnail
{
  slug: string;
  source: string;
  images: RSIStarMapStarSystemImages;
}

/**
 * Image URLs of a thumbnail, keyed by RSI image format.
 *
 * @category Starmaps
 */
export interface RSIStarMapStarSystemImages
{
  post: string;
  product_thumb_large: string;
  subscribers_vault_thumbnail: string;
}

/**
 * Rendering data of a star system.
 *
 * @category Starmaps
 */
export interface RSIStarMapStarSystemShaderData
{
  lightColor: string;
  starfield: RSIStarMapStarSystemStarfield;
  planetsSize: RSIStarMapStarSystemPlanetsSize;
}

/**
 * Planet size range used by the starmap renderer.
 *
 * @category Starmaps
 */
export interface RSIStarMapStarSystemPlanetsSize
{
  min: number;
  max: number;
  kFactor: number;
}

/**
 * Starfield settings used by the starmap renderer.
 *
 * @category Starmaps
 */
export interface RSIStarMapStarSystemStarfield
{
  radius: number;
  count: number;
  sizeMin: number;
  sizeMax: number;
  color1: string;
  color2: string;
}