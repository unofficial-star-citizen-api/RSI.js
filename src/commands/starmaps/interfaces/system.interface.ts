export interface RSIStarMapSearchResult
{
  success: number;
  code: string;
  msg: string;
  data: RSIStarMapSearchResultData;
}

export interface RSIStarMapSearchResultData
{
  systems: RSIStarMapSearchResultSystems;
  objects: RSIStarMapSearchResultObjects;
}

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

export interface RSIStarMapSearchResultObjectsResultset
{
  id: number;
  code: string;
  designation: string;
  name: null | string;
  star_system_id: number;
  status: RSIStarMapSearchResultStatus;
  type: string;
  star_system: RSIStarMapSearchResultStarSystemElement;
}

export interface RSIStarMapSearchResultStarSystemElement
{
  id: number;
  code: RSIStarMapSearchResultCode;
  name: RSIStarMapSearchResultName;
  type: RSIStarMapSearchResultType;
}

export enum RSIStarMapSearchResultCode
{
  Magnus = "MAGNUS",
  Nyx = "NYX",
  Pyro = "PYRO",
  Stanton = "STANTON",
  Terra = "TERRA",
}

export enum RSIStarMapSearchResultName
{
  Magnus = "Magnus",
  Nyx = "Nyx",
  Pyro = "Pyro",
  Stanton = "Stanton",
  Terra = "Terra",
}

export enum RSIStarMapSearchResultType
{
  SingleStar = "SINGLE_STAR",
}

export enum RSIStarMapSearchResultStatus
{
  P = "P",
}

export interface RSIStarMapSearchResultSystems
{
  rowcount: number;
  pagecount: null;
  startrow: number;
  resultset: RSIStarMapSearchResultStarSystemElement[];
  totalrows: number;
  pagesize: number;
  page: number;
  offset: number;
  estimatedrows: boolean;
}
