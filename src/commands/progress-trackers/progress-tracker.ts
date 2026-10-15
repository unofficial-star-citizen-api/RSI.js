import { HttpClient } from '@/http-client';
import { ProgressTrackerDeliverable } from './progress-tracker-deliverable';
import { ProgressTrackerTeam } from './progress-tracker-team';

export class ProgressTrackers
{
  public readonly getTeams: ProgressTrackerTeam['getTeams'];
  public readonly getTeamBySlug: ProgressTrackerTeam['getTeamBySlug'];
  public readonly getDeliverables: ProgressTrackerDeliverable['getDeliverables'];
  public readonly getDeliverablesByTeamSlug: ProgressTrackerDeliverable['getDeliverablesByTeamSlug'];

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