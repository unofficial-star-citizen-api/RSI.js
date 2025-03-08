import { HttpClient, HttpConfigOptions } from './http-client';
import {
  Organization,
  Roadmap,
  Ship,
  Starmap,
  Stats,
  Telemetry,
  User,
  ProgressTracker,
  Version
} from './commands';

export interface RSIConfig {
  httpConfig?: Partial<HttpConfigOptions>;
}

export class RSI {
  public readonly httpClient: HttpClient;

  public readonly user: User;
  public readonly organization: Organization;
  public readonly progressTracker: ProgressTracker;
  public readonly roadmap: Roadmap;
  public readonly ships: Ship;
  public readonly starmap: Starmap;
  public readonly stats: Stats;
  public readonly telemetry: Telemetry;
  public readonly version: Version;

  constructor(config: RSIConfig = {}) {
    this.httpClient = new HttpClient(config.httpConfig);

    this.user = new User(this.httpClient);
    this.organization = new Organization(this.httpClient);
    this.progressTracker = new ProgressTracker(this.httpClient);
    this.roadmap = new Roadmap(this.httpClient);
    this.ships = new Ship(this.httpClient);
    this.starmap = new Starmap(this.httpClient);
    this.stats = new Stats(this.httpClient);
    this.telemetry = new Telemetry(this.httpClient);
    this.version = new Version(this.httpClient);
  }
}

export default RSI;