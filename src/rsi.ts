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

export interface RSIConfig
{
  httpConfig?: Partial<HttpConfigOptions>;
}

export class RSI
{
  public readonly httpClient: HttpClient;

  public readonly users: Users;
  public readonly organizations: Organizations;
  public readonly progressTrackers: ProgressTrackers;
  public readonly roadmaps: Roadmaps;
  public readonly ships: Ships;
  public readonly starmaps: Starmaps;
  public readonly fundingGoals: FundingGoals;
  public readonly telemetries: Telemetries;
  public readonly versions: Versions;

  constructor(config: RSIConfig = {})
  {
    this.httpClient = new HttpClient(config.httpConfig);

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