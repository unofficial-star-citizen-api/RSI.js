export interface RSIStarMapSearchResponse
{
  systems: RSIStarMapSearchResultStarSystemRuleset[];
  objects: RSIStarMapSearchResultObjectsResultset[];
}

/** @internal */
export interface RSIStarMapSearchResult
{
  success: number;
  code: string;
  msg: string;
  data: RSIStarMapSearchResultData;
}

/** @internal */
export interface RSIStarMapSearchResultData
{
  systems: RSIStarMapSearchResultSystems;
  objects: RSIStarMapSearchResultObjects;
}

/** @internal */
export interface RSIStarMapSearchResultObjects
{
  rowcount: number;
  pagecount: null;
  startrow: number;
  resultset: RSIStarMapSearchResultObjectsResultset[];
  totalrows: number;
  pagesize: number;
  page: number;
  offset: number;
  estimatedrows: boolean;
}

/** @internal */
export interface RSIStarMapSearchResultObjectsResultset
{
  id: number;
  code: string;
  designation: string;
  name: null | string;
  star_system_id: number;
  status: RSIStarMapSearchResultStatus;
  type: string;
  star_system: RSIStarMapSearchResultStarSystemRuleset;
}

export interface RSIStarMapSearchResultStarSystemRuleset
{
  id: number;
  code: RSIStarMapSearchResultCode;
  name: RSIStarMapSearchResultName;
  type: RSIStarMapSearchResultType;
}

export enum RSIStarMapSearchResultCode
{
  Magnus = 'MAGNUS',
  Nyx = 'NYX',
  Pyro = 'PYRO',
  Stanton = 'STANTON',
  Terra = 'TERRA',
}

export enum RSIStarMapSearchResultName
{
  Magnus = 'Magnus',
  Nyx = 'Nyx',
  Pyro = 'Pyro',
  Stanton = 'Stanton',
  Terra = 'Terra',
}

export enum RSIStarMapSearchResultType
{
  SingleStar = 'SINGLE_STAR',
}

export enum RSIStarMapSearchResultStatus
{
  P = 'P',
}

/** @internal */
export interface RSIStarMapSearchResultSystems
{
  rowcount: number;
  pagecount: null;
  startrow: number;
  resultset: RSIStarMapSearchResultStarSystemRuleset[];
  totalrows: number;
  pagesize: number;
  page: number;
  offset: number;
  estimatedrows: boolean;
}
