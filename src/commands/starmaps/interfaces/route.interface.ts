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
  id: any;
  name: string;
  type: string;
  system_id: number;
  system_code: string;
  object_id?: number;
  object_code?: string;
  segment_type: string;
  segment_distance?: number;
  is_departure: any;
  is_destination: any;
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
