export interface RSIStarmapAffiliation
{
  name: string;
  code: string;
  [key: string]: unknown;
}
export interface RSIStarmapCelestialObject
{
  [key: string]: unknown;
}

export enum RSIStarmapRouteShipSize
{
  Small = 'S',
  Medium = 'M',
  Large = 'L'
}

export interface RSIStarmapRoute
{
  shortest: Array<Record<string, unknown>>;
  leastjumps: Array<Record<string, unknown>>;
}

export interface RSIStarmapSearchResult
{
  systems: Array<Record<string, unknown>>;
  objects: Array<Record<string, unknown>>;
}

export interface RSIStarmapSpecies
{
  name: string;
  code: string;
  [key: string]: unknown;
}

export interface RSIStarmapStarSystemDetail
{
  [key: string]: unknown;
}

export interface RSIStarmapStarSystem
{
  id: string;
  name: string;
  code: string;
  [key: string]: unknown;
}

export interface RSIStarmapTunnel
{
  id: number;
  [key: string]: unknown;
}