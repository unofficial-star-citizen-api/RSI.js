import { HttpClient } from '@/http-client';
import { ProgressTrackerDeliverable } from './progress-tracker-deliverable';
import { ProgressTrackerTeam } from './progress-tracker-team';

export class ProgressTrackers
{
  public readonly getTeamsInRange: ProgressTrackerTeam['getTeamsInRange'];
  public readonly getTeamDeliverableInfo: ProgressTrackerDeliverable['getTeamDeliverableInfo'];


  constructor(httpClient: HttpClient)
  {
    const team = new ProgressTrackerTeam(httpClient);
    this.getTeamsInRange = team.getTeamsInRange.bind(team);

    const deliverable = new ProgressTrackerDeliverable(httpClient);
    this.getTeamDeliverableInfo = deliverable.getTeamDeliverableInfo.bind(deliverable);
  }
}