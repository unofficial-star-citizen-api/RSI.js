export interface RSIStarMapSearchResponse
{
  systems: RSIStarMapSearchResultStarSystem[];
  objects: RSIStarMapSearchResultObject[];
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
  pagecount: null | number;
  startrow: number;
  resultset: RSIStarMapSearchResultObject[];
  totalrows: number;
  pagesize: number;
  page: number;
  offset: number;
  estimatedrows: boolean;
}

export interface RSIStarMapSearchResultObject
{
  id: number;
  code: string;
  designation: string;
  name: null | string;
  star_system_id: number;
  status: string;
  type: string;
  star_system: RSIStarMapSearchResultStarSystem;
}

export interface RSIStarMapSearchResultStarSystem
{
  id: number;
  code: string;
  name: string;
  type: string;
}

/** @internal */
export interface RSIStarMapSearchResultSystems
{
  rowcount: number;
  pagecount: null | number;
  startrow: number;
  resultset: RSIStarMapSearchResultStarSystem[];
  totalrows: number;
  pagesize: number;
  page: number;
  offset: number;
  estimatedrows: boolean;
}
