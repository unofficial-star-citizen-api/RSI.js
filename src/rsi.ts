import
{
  FundingGoals,
  Organizations,
  ProgressTrackers,
  Roadmaps,
  Ships,
  Starmaps,
  Telemetries,
  Users,
  Versions,
} from './commands';
import { HttpClient, HttpConfigOptions } from './http-client';
import { Logger } from './logger';

/**
 * Options accepted by the {@link RSI} constructor.
 *
 * @category Client
 */
export interface RSIConfig
{
  /**
   * HTTP options: timeout, user agent and proxies.
   * In Node.js, unset options fall back to environment variables (see {@link HttpConfigOptions}).
   */
  httpConfig?: Partial<HttpConfigOptions>;

  /**
   * Print command activity, HTTP requests (method and URL), HTTP responses (status code)
   * and proxy errors to the console. Bodies and headers are never logged.
   *
   * The toggle is global: the most recently created `RSI` instance decides it for every instance.
   * @default false
   */
  logging?: boolean;
}

/**
 * Entry point of the library: one client that exposes every RSI data source as a module.
 *
 * All modules share a single {@link HttpClient}, so proxy and timeout settings apply everywhere.
 * Every method is `async` and returns typed results; failures throw an {@link RSIError}.
 *
 * @category Client
 *
 * @example Quick start
 * ```typescript
 * import { RSI } from '@unofficial-star-citizen-api/rsi.js';
 *
 * const rsi = new RSI();
 *
 * const profile = await rsi.users.getProfile('Dymerz');
 * console.log(profile?.handle, profile?.meta.url);
 *
 * const org = await rsi.organizations.get('PROTECTORA');
 * console.log(org.name, org.membersCount);
 * ```
 *
 * @example Proxy, timeout and logging
 * ```typescript
 * import { RSI } from '@unofficial-star-citizen-api/rsi.js';
 *
 * const rsi = new RSI({
 *   httpConfig: {
 *     timeout: 30_000,
 *     userAgent: 'MyBot/1.0 (me@example.com)',
 *     httpsProxy: 'socks5://localhost:5566',
 *     noProxy: 'localhost,*.internal',
 *   },
 *   logging: true,
 * });
 * ```
 */
export class RSI
{
  /** HTTP client shared by every module */
  public readonly httpClient: HttpClient;

  /** Citizen profiles and organization affiliations, see {@link Users} */
  public readonly users: Users;
  /** Organization details, search and members, see {@link Organizations} */
  public readonly organizations: Organizations;
  /** Progress tracker teams and deliverables, see {@link ProgressTrackers} */
  public readonly progressTrackers: ProgressTrackers;
  /** Star Citizen and Squadron 42 release roadmaps, see {@link Roadmaps} */
  public readonly roadmaps: Roadmaps;
  /** Ships by ID, chassis or search, with ship-matrix specs and store prices, see {@link Ships} */
  public readonly ships: Ships;
  /** ARK Starmap systems, celestial objects and routes, see {@link Starmaps} */
  public readonly starmaps: Starmaps;
  /** Crowdfunding stats, see {@link FundingGoals} */
  public readonly fundingGoals: FundingGoals;
  /** Community telemetry, see {@link Telemetries} */
  public readonly telemetries: Telemetries;
  /** Game versions and patch notes, see {@link Versions} */
  public readonly versions: Versions;

  /**
   * @param config - HTTP and logging options; every field is optional
   */
  constructor(config: RSIConfig = {})
  {
    this.httpClient = new HttpClient(config.httpConfig);
    Logger.enabled = config.logging ?? false;

    this.users = new Users(this.httpClient);
    this.organizations = new Organizations(this.httpClient);
    this.progressTrackers = new ProgressTrackers(this.httpClient);
    this.roadmaps = new Roadmaps(this.httpClient);
    this.ships = new Ships(this.httpClient);
    this.starmaps = new Starmaps(this.httpClient);
    this.fundingGoals = new FundingGoals(this.httpClient);
    this.telemetries = new Telemetries(this.httpClient);
    this.versions = new Versions(this.httpClient);
  }
}

export default RSI;