/** @internal */
export interface RSIStarMapStarSystem
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
  pagecount: null;
  startrow: number;
  resultset: RSIStarMapStarSystemResultset[];
  totalrows: number;
  pagesize: number;
  page: number;
  offset: number;
  estimatedrows: boolean;
}

export interface RSIStarMapStarSystemResultset
{
  id: number;
  code: string;
  description: string;
  frost_line: number;
  habitable_zone_inner: number;
  habitable_zone_outer: number;
  info_url: null;
  name: string;
  position_x: number;
  position_y: number;
  position_z: number;
  shader_data: RSIStarMapStarSystemResultsetShaderData;
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

export interface RSIStarMapStarSystemAffiliation
{
  id: number;
  code: RSIStarMapStarSystemCode;
  color: RSIStarMapStarSystemColorEnum;
  name: RSIStarMapStarSystemName;
  "membership.id": number;
}

export enum RSIStarMapStarSystemCode
{
  UNC = "UNC",
  Uee = "uee",
}

export enum RSIStarMapStarSystemColorEnum
{
  F6851F = "#f6851f",
  The48Bbd4 = "#48bbd4",
}

export enum RSIStarMapStarSystemName
{
  Uee = "UEE",
  Unclaimed = "Unclaimed",
}

export interface RSIStarMapStarSystemCelestialObject
{
  id: number;
  age: number | null;
  appearance: RSIStarMapStarSystemAppearance | null;
  axial_tilt: number | null;
  code: string;
  description: null | string;
  designation: string;
  distance: number | null;
  fairchanceact: boolean | null;
  habitable: boolean | null;
  info_url: null;
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
  type: RSIStarMapStarSystemType;
  subtype: RSIStarMapStarSystemSubtype | null;
  affiliation: RSIStarMapStarSystemAffiliation[];
  population: unknown[];
  texture?: RSIStarMapStarSystemThumbnail;
  thumbnail?: RSIStarMapStarSystemThumbnail;
  model?: RSIStarMapStarSystemModel;
}

export enum RSIStarMapStarSystemAppearance
{
  Custom = "CUSTOM",
  Default = "DEFAULT",
  PlanetBlue = "PLANET_BLUE",
  PlanetBrown = "PLANET_BROWN",
  PlanetGas = "PLANET_GAS",
  PlanetGreen = "PLANET_GREEN",
}

export interface RSIStarMapStarSystemModel
{
  slug: string;
  source: string;
  images: unknown[];
}

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

export interface RSIStarMapStarSystemSubtype
{
  id: number;
  name: string;
  type: RSIStarMapStarSystemType;
}

export enum RSIStarMapStarSystemType
{
  AsteroidBelt = "ASTEROID_BELT",
  AsteroidField = "ASTEROID_FIELD",
  Jumppoint = "JUMPPOINT",
  Manmade = "MANMADE",
  Planet = "PLANET",
  Satellite = "SATELLITE",
  Star = "STAR",
}

export interface RSIStarMapStarSystemThumbnail
{
  slug: string;
  source: string;
  images: RSIStarMapStarSystemImages;
}

export interface RSIStarMapStarSystemImages
{
  post: string;
  product_thumb_large: string;
  subscribers_vault_thumbnail: string;
}

export interface RSIStarMapStarSystemResultsetShaderData
{
  lightColor: string;
  starfield: RSIStarMapStarSystemStarfield;
  planetsSize: RSIStarMapStarSystemPlanetsSize;
}

export interface RSIStarMapStarSystemPlanetsSize
{
  min: number;
  max: number;
  kFactor: number;
}

export interface RSIStarMapStarSystemStarfield
{
  radius: number;
  count: number;
  sizeMin: number;
  sizeMax: number;
  color1: string;
  color2: string;
}