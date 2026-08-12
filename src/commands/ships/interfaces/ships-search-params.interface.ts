/**
 * Advanced search parameters for ship queries
 */
export interface RSIShipSearchParams
{
  /** Search by ship name */
  name?: string;
  /** Filter by ship classification (combat, transport, exploration, etc.) */
  classification?: RSIShipClassification;
  /** Minimum ship length in meters */
  length_min?: number;
  /** Maximum ship length in meters */
  length_max?: number;
  /** Minimum crew capacity */
  crew_min?: number;
  /** Maximum crew capacity */
  crew_max?: number;
  /** Minimum price in UEC (United Earth Credits) */
  price_min?: number;
  /** Maximum price in UEC (United Earth Credits) */
  price_max?: number;
  /** Minimum ship mass in kilograms */
  mass_min?: number;
  /** Maximum ship mass in kilograms */
  mass_max?: number;
  /** Production status of the ship */
  status?: RSIShipStatus;
  /** Filter ships available for purchase only */
  sale?: boolean;
  /** Ship size category */
  size?: RSIShipSize;
  /** Maximum page number to retrieve (for pagination) */
  page_max?: number;
  /** Current page number (for pagination) */
  page?: number;
}

/**
 * Ship classification types available in the RSI store
 */
export enum RSIShipClassification
{
  Combat = 'combat',
  Transport = 'transport',
  Exploration = 'exploration',
  Industrial = 'industrial',
  Support = 'support',
  Competition = 'competition',
  Ground = 'ground',
  Multi = 'multi',
}

/**
 * Ship production status types
 */
export enum RSIShipStatus
{
  InConcept = 'in-concept',
  FlightReady = 'flight-ready',
}

/**
 * Ship size categories
 */
export enum RSIShipSize
{
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  Capital = 'capital',
  Snub = 'snub',
  Vehicle = 'vehicle',
}
