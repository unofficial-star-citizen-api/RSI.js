import { BaseCommand } from '../interfaces/command.interface';
import { Connector } from '../services';
import { StarSystemInterface } from '../interfaces/star-system.interface';
import { TunnelInterface } from '../interfaces/tunnel.interface';
import { SpeciesInterface } from '../interfaces/species.interface';
import { AffiliationInterface } from '../interfaces/affiliation.interface';
import { StarSystemDetailInterface } from '../interfaces/star-system-detail.interface';
import { CelestialObjectInterface } from '../interfaces/celestial-object.interface';
import { SearchResultInterface } from '../interfaces/search-result.interface';
import { RouteResultInterface } from '../interfaces/route-result.interface';

// Helper function to get starmap data
async function getStarmapData<T>(field: string): Promise<T[] | null> {
  const connector = new Connector();
  const url = "https://robertsspaceindustries.com/api/starmap/bootup";

  const req = await connector.request<{
    success: number;
    data?: Record<string, { resultset: T[] }>;
  }>(url);

  if (req === null || req.status !== 200) {
    return null;
  }

  const resp = req.data;

  if (resp.success !== 1 || !resp.data) {
    return null;
  }

  return resp.data[field]?.resultset || null;
}

/**
 * StarmapSystems class for retrieving Star Citizen starmap systems
 */
export class StarmapSystems extends BaseCommand<StarSystemInterface[]> {
  private readonly name?: string;

  constructor(name?: string) {
    super();
    this.name = name;
  }

  async execute(): Promise<StarSystemInterface[] | null> {
    const systems = await getStarmapData<StarSystemInterface>("systems");
    if (systems === null) {
      return null;
    }

    if (this.name === undefined) {
      return systems;
    }

    const res = systems.filter(s => String(s.name).toLowerCase() === String(this.name).toLowerCase());

    return res.length > 0 ? res : null;
  }
}

/**
 * StarmapTunnels class for retrieving Star Citizen starmap tunnels
 */
export class StarmapTunnels extends BaseCommand<TunnelInterface[]> {
  private readonly tid?: string;

  constructor(tid?: string) {
    super();
    this.tid = tid;
  }

  async execute(): Promise<TunnelInterface[] | null> {
    const tunnels = await getStarmapData<TunnelInterface>("tunnels");
    if (tunnels === null) {
      return null;
    }

    if (this.tid === undefined) {
      return tunnels;
    }

    const res = tunnels.filter(s => String(s.id).toLowerCase() === String(this.tid).toLowerCase());

    return res.length > 0 ? res : null;
  }
}

/**
 * StarmapSpecies class for retrieving Star Citizen starmap species
 */
export class StarmapSpecies extends BaseCommand<SpeciesInterface[]> {
  private readonly name?: string;

  constructor(name?: string) {
    super();
    this.name = name;
  }

  async execute(): Promise<SpeciesInterface[] | null> {
    const species = await getStarmapData<SpeciesInterface>("species");
    if (species === null) {
      return null;
    }

    if (this.name === undefined) {
      return species;
    }

    const res = species.filter(s =>
      String(s.name).toLowerCase() === String(this.name).toLowerCase() ||
      String(s.code).toLowerCase() === String(this.name).toLowerCase()
    );

    return res.length > 0 ? res : null;
  }
}

/**
 * StarmapAffiliations class for retrieving Star Citizen starmap affiliations
 */
export class StarmapAffiliations extends BaseCommand<AffiliationInterface[]> {
  private readonly name?: string;

  constructor(name?: string) {
    super();
    this.name = name;
  }

  async execute(): Promise<AffiliationInterface[] | null> {
    const affiliations = await getStarmapData<AffiliationInterface>("affiliations");
    if (affiliations === null) {
      return null;
    }

    if (this.name === undefined) {
      return affiliations;
    }

    const res = affiliations.filter(s => s.name === this.name || s.code === this.name);

    return res.length > 0 ? res : null;
  }
}

/**
 * StarmapStarSystems class for retrieving Star Citizen starmap star systems
 */
export class StarmapStarSystems extends BaseCommand<StarSystemDetailInterface> {
  private readonly urlStarSystem = "https://robertsspaceindustries.com/api/starmap/star-systems/{0}";
  private readonly code: string;
  private connector: Connector;

  constructor(code: string) {
    super();
    this.code = code;
    this.connector = new Connector();
  }

  async execute(): Promise<StarSystemDetailInterface | null> {
    const req = await this.connector.request<{
      success: number;
      data?: { resultset: StarSystemDetailInterface };
    }>(this.urlStarSystem.replace('{0}', this.code));

    if (req === null || req.status !== 200) {
      return null;
    }

    const resp = req.data;

    // Check response
    if (resp.success !== 1 || !resp.data) {
      return null;
    }

    return resp.data.resultset;
  }
}

/**
 * StarmapCelestialObjects class for retrieving Star Citizen celestial objects
 */
export class StarmapCelestialObjects extends BaseCommand<CelestialObjectInterface> {
  private readonly urlCelestial = "https://robertsspaceindustries.com/api/starmap/celestial-objects/{0}";
  private readonly code: string;
  private connector: Connector;

  constructor(code: string) {
    super();
    this.code = code;
    this.connector = new Connector();
  }

  async execute(): Promise<CelestialObjectInterface | null> {
    const req = await this.connector.request<{
      success: number;
      data?: { resultset: CelestialObjectInterface };
    }>(this.urlCelestial.replace('{0}', this.code));

    if (req === null || req.status !== 200) {
      return null;
    }

    const resp = req.data;

    // Check response
    if (resp.success !== 1 || !resp.data) {
      return null;
    }

    return resp.data.resultset;
  }
}

/**
 * StarmapSearch class for searching Star Citizen starmap
 */
export class StarmapSearch extends BaseCommand<SearchResultInterface> {
  private readonly urlFind = "https://robertsspaceindustries.com/api/starmap/find";
  private readonly search: string;
  private connector: Connector;

  constructor(search: string) {
    super();
    this.search = search;
    this.connector = new Connector();
  }

  async execute(): Promise<SearchResultInterface | null> {
    const data = {
      query: this.search
    };

    const req = await this.connector.request<{
      success: number;
      data?: {
        systems: { resultset: Array<Record<string, unknown>> };
        objects: { resultset: Array<Record<string, unknown>> }
      };
    }>(this.urlFind, data);

    if (req === null || req.status !== 200) {
      return null;
    }

    const resp = req.data;

    // Check response
    if (resp.success !== 1 || !resp.data) {
      return null;
    }

    return {
      systems: resp.data.systems.resultset,
      objects: resp.data.objects.resultset
    };
  }
}

/**
 * StarmapRouteSearch class for searching routes in Star Citizen starmap
 */
export class StarmapRouteSearch extends BaseCommand<RouteResultInterface> {
  private readonly urlFind = "https://robertsspaceindustries.com/api/starmap/routes/find";
  private readonly from: string;
  private readonly to: string;
  private readonly size: string;
  private connector: Connector;

  constructor(from: string, to: string, shipSize: string) {
    super();
    this.from = from;
    this.to = to;
    this.size = shipSize;
    this.connector = new Connector();
  }

  async execute(): Promise<RouteResultInterface | null> {
    const data = {
      departure: this.from,
      destination: this.to,
      ship_size: this.size
    };

    const req = await this.connector.request<{
      success: number;
      data?: {
        shortest: Array<Record<string, unknown>>;
        leastjumps: Array<Record<string, unknown>>;
      };
    }>(this.urlFind, data);

    if (req === null || req.status !== 200) {
      return null;
    }

    const resp = req.data;

    // Check response
    if (resp.success !== 1 || !resp.data) {
      return null;
    }

    return {
      shortest: resp.data.shortest,
      leastjumps: resp.data.leastjumps
    };
  }
}
