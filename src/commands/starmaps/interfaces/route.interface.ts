export interface RSIStarmapRoute
{
  shortest: RSIStarmapRouteShortest;
  leastjumps: RSIStarmapRouteLeastJumps;
}

export interface RSIStarmapRouteShortest
{
  name: string;
  label: string;
  first_jump: string;
  flight_distance: number;
  jumps: number;
  segments: RSIStarmapRouteSegment[];
}

export interface RSIStarmapRouteSegment
{
  id: number | string;
  name: string;
  type: string;
  system_id: number;
  system_code: string;
  object_id?: number;
  object_code?: string;
  segment_type: string;
  segment_distance?: number;
  is_departure: 1 | false;
  is_destination: 1 | false;
}

export interface RSIStarmapRouteLeastJumps
{
  name: string;
  label: string;
  first_jump: string;
  flight_distance: number;
  jumps: number;
  segments: RSIStarmapRouteSegment[];
}
