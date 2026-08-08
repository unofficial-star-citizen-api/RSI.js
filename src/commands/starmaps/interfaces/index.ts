export * from './route.interface';

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
  pagecount: null;
  startrow: number;
  resultset: RSIStarMapObjectAffiliationElement[];
  totalrows: number;
  pagesize: number;
  page: number;
  offset: number;
  estimatedrows: boolean;
}

export interface RSIStarMapObjectAffiliationElement
{
  id: number;
  code: RSIStarMapObjectCode;
  color?: RSIStarMapObjectColor;
  name: RSIStarMapObjectName;
  'membership.id'?: number;
}

export enum RSIStarMapObjectCode
{
  Banu = 'BANU',
  Dev = 'DEV',
  Human = 'HUMAN',
  Krthak = 'KRTHAK',
  Tevarin = 'TEVARIN',
  UNC = 'UNC',
  Uee = 'uee',
  Vncl = 'VNCL',
  Xian = 'XIAN',
}

export enum RSIStarMapObjectColor
{
  Bd002D = '#bd002d',
  Ca922D = '#ca922d',
  F6851F = '#f6851f',
  Ffce17 = '#ffce17',
  The48Bbd4 = '#48bbd4',
  The52C231 = '#52c231',
}

export enum RSIStarMapObjectName
{
  Banu = 'Banu',
  Developing = 'Developing',
  Human = 'Human',
  KrThak = 'Kr\'Thak',
  NameXiAn = 'Xi\'An',
  Tevarin = 'Tevarin',
  Uee = 'UEE',
  Unclaimed = 'Unclaimed',
  Vanduul = 'Vanduul',
  XiAn = 'Xi\'an',
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

export interface RSIStarMapObjectStarfield
{
  radius: number;
  count: number;
  sizeMin: number;
  sizeMax: number;
  color1: string;
  color2: string;
}

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
  pagecount: null;
  startrow: number;
  resultset: RSIStarMapObjectSystemsResultset[];
  totalrows: number;
  pagesize: number;
  page: number;
  offset: number;
  estimatedrows: boolean;
}

export interface RSIStarMapObjectSystemsResultset
{
  id: number;
  code: string;
  description: string;
  info_url: null | string;
  name: string;
  position_x: number;
  position_y: number;
  position_z: number;
  status: RSIStarMapObjectStatus;
  time_modified: string;
  type: RSIStarMapObjectResultsetType;
  affiliation: RSIStarMapObjectAffiliationElement[];
  aggregated_size: string;
  aggregated_population: number;
  aggregated_economy: number;
  aggregated_danger: number;
  thumbnail?: RSIStarMapObjectThumbnail;
}

export enum RSIStarMapObjectStatus
{
  M = 'M',
  N = 'N',
  P = 'P',
}

export interface RSIStarMapObjectThumbnail
{
  slug: string;
  source: string;
  images: unknown[] | RSIStarMapObjectImagesClass;
}

export interface RSIStarMapObjectImagesClass
{
  post: string;
  product_thumb_large: string;
  subscribers_vault_thumbnail: string;
}

export enum RSIStarMapObjectResultsetType
{
  Binary = 'BINARY',
  SingleStar = 'SINGLE_STAR',
}

/** @internal */
export interface RSIStarMapObjectTunnels
{
  rowcount: number;
  pagecount: null;
  startrow: number;
  resultset: RSIStarMapObjectTunnelsResultset[];
  totalrows: number;
  pagesize: number;
  page: number;
  offset: number;
  estimatedrows: boolean;
}

export interface RSIStarMapObjectTunnelsResultset
{
  id: number;
  direction: RSIStarMapObjectDirection;
  entry_id: number;
  exit_id: number;
  name: null | string;
  size: RSIStarMapObjectSize;
  entry: RSIStarMapObjectEntry;
  exit: RSIStarMapObjectEntry;
}

export enum RSIStarMapObjectDirection
{
  B = 'B',
}

export interface RSIStarMapObjectEntry
{
  id: number;
  code: string;
  designation: string;
  distance: number;
  latitude: number | null;
  longitude: number;
  name: null;
  star_system_id: number;
  status: RSIStarMapObjectStatus;
  type: RSIStarMapObjectEntryType;
}

export enum RSIStarMapObjectEntryType
{
  Jumppoint = 'JUMPPOINT',
}

export enum RSIStarMapObjectSize
{
  L = 'L',
  M = 'M',
  S = 'S',
}
