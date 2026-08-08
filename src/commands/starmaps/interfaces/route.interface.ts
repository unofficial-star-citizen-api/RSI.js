export interface RSIStarmapRoute
{
  shortest: RSIRouteResultShortest;
  leastjumps: RSIRouteResultLeastJumps;
}

export interface RSIRouteResultShortest
{
  name: string;
  label: string;
  first_jump: string;
  flight_distance: number;
  jumps: number;
  segments: RSIRouteResultSegment[];
}

export interface RSIRouteResultSegment
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

export interface RSIRouteResultLeastJumps
{
  name: string;
  label: string;
  first_jump: string;
  flight_distance: number;
  jumps: number;
  segments: RSIRouteResultSegment[];
}
