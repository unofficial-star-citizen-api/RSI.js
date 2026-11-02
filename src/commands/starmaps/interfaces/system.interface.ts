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
  systems: RSIStarMapSearchSystems;
  objects: RSIStarMapSearchResultObjects;
}

/** @internal */
export interface RSIStarMapSearchResultObjects
{
  rowcount: number;
  pagecount: null | number;
  startrow: number;
  resultset: RSIStarMapSearchObject[];
  totalrows: number;
  pagesize: number;
  page: number;
  offset: number;
  estimatedrows: boolean;
}

/**
 * Results of {@link Starmaps.search}.
 *
 * @category Starmaps
 */
export interface RSIStarMapSearch
{
  systems: RSIStarMapSearchStarSystem[];
  objects: RSIStarMapSearchObject[];
}

/**
 * A celestial object matching a starmap search.
 *
 * @category Starmaps
 */
export interface RSIStarMapSearchObject
{
  id: number;
  code: string;
  designation: string;
  name: null | string;
  star_system_id: number;
  status: string;
  type: string;
  star_system: RSIStarMapSearchStarSystem;
}

/**
 * A star system matching a starmap search.
 *
 * @category Starmaps
 */
export interface RSIStarMapSearchStarSystem
{
  id: number;
  code: string;
  name: string;
  type: string;
}

/** @internal */
export interface RSIStarMapSearchSystems
{
  rowcount: number;
  pagecount: null | number;
  startrow: number;
  resultset: RSIStarMapSearchStarSystem[];
  totalrows: number;
  pagesize: number;
  page: number;
  offset: number;
  estimatedrows: boolean;
}
