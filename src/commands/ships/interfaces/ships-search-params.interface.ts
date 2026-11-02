/**
 * Filters for {@link Ships.search}. Every field is optional.
 *
 * @category Types/Ships
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
  /** Minimum store price in USD */
  price_min?: number;
  /** Maximum store price in USD */
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
  /**
   * Last store page to read. Pages from `page` to `page_max` are read in batches of 5,
   * stopping at the first empty page.
   * @default 1
   */
  page_max?: number;
  /**
   * First store page to read, starting at 1
   * @default 1
   */
  page?: number;
}

/**
 * Ship classifications available in the RSI store, for {@link RSIShipSearchParams.classification}.
 *
 * @category Types/Ships
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
 * Production status filter for {@link RSIShipSearchParams.status}.
 *
 * @category Types/Ships
 */
export enum RSIShipStatus
{
  InConcept = 'in-concept',
  FlightReady = 'flight-ready',
}

/**
 * Ship size filter for {@link RSIShipSearchParams.size}.
 *
 * @category Types/Ships
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
