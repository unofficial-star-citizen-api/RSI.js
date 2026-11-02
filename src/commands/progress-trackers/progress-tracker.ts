import { HttpClient } from '@/http-client';
import { RSIProgressTrackerDeliverable, RSIProgressTrackerTeam } from './interfaces';
import { ProgressTrackerDeliverable } from './progress-tracker-deliverable';
import { ProgressTrackerTeam } from './progress-tracker-team';

/**
 * Progress tracker: development teams, their time allocations and the deliverables they work on.
 * Access it through {@link RSI.progressTrackers}.
 *
 * Every method walks all result pages of RSI's GraphQL API, 20 items per request,
 * and covers 2020-01-01 to two years from today.
 *
 * @category Commands
 * @hideconstructor
 * @see https://robertsspaceindustries.com/roadmap/progress-tracker
 */
export class ProgressTrackers
{
  /**
   * Get every team on the progress tracker, with its time allocations.
   *
   * @returns All teams
   * @throws {@link RSIError} if RSI answers with a non-200 status, no data or GraphQL errors
   *
   * @example
   * ```typescript
   * import { RSI } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   * const teams = await rsi.progressTrackers.getTeams();
   *
   * console.log(teams.map(team => `${team.abbreviation}: ${team.numberOfDeliverables} deliverables`));
   * ```
   */
  public readonly getTeams: () => Promise<RSIProgressTrackerTeam[]>;

  /**
   * Get a single team by its slug.
   *
   * @param teamSlug - Slug of the team, for example `g42qg07ipfday`; slugs are listed by {@link ProgressTrackers.getTeams}
   * @returns The team, or `undefined` if no team has this slug
   * @throws {@link RSIError} if RSI answers with a non-200 status, no data or GraphQL errors
   *
   * @example
   * ```typescript
   * const team = await rsi.progressTrackers.getTeamBySlug('g42qg07ipfday');
   * console.log(team?.title); // for example 'Game Code (Persistent Universe)'
   * ```
   */
  public readonly getTeamBySlug: (teamSlug: string) => Promise<RSIProgressTrackerTeam | undefined>;

  /**
   * Get every deliverable on the progress tracker, with its teams, projects and roadmap card.
   *
   * @returns All deliverables
   * @throws {@link RSIError} if RSI answers with a non-200 status, no data or GraphQL errors
   *
   * @example
   * ```typescript
   * import { RSI } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   * const deliverables = await rsi.progressTrackers.getDeliverables();
   *
   * console.log(deliverables.map(d => `${d.title} (${d.card?.release?.title ?? 'unscheduled'})`));
   * ```
   */
  public readonly getDeliverables: () => Promise<RSIProgressTrackerDeliverable[]>;

  /**
   * Get the deliverables a team works on.
   *
   * @param teamSlug - Slug of the team; slugs are listed by {@link ProgressTrackers.getTeams}
   * @returns The team's deliverables
   * @throws {@link RSIError} if RSI answers with a non-200 status, no data or GraphQL errors
   *
   * @example
   * ```typescript
   * const deliverables = await rsi.progressTrackers.getDeliverablesByTeamSlug('g42qg07ipfday');
   * console.log(deliverables.map(d => d.title));
   * ```
   */
  public readonly getDeliverablesByTeamSlug: (teamSlug: string) => Promise<RSIProgressTrackerDeliverable[]>;

  /** @hidden */
  constructor(httpClient: HttpClient)
  {
    const team = new ProgressTrackerTeam(httpClient);
    this.getTeams = team.getTeams.bind(team);
    this.getTeamBySlug = team.getTeamBySlug.bind(team);

    const deliverable = new ProgressTrackerDeliverable(httpClient);
    this.getDeliverables = deliverable.getDeliverables.bind(deliverable);
    this.getDeliverablesByTeamSlug = deliverable.getDeliverablesByTeamSlug.bind(deliverable);
  }
}
