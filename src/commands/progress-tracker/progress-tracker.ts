import { HttpClient } from 'src/http-client'
import { ProgressTrackerDeliverable } from './progress-tracker-deliverable'
import { ProgressTrackerTeam } from './progress-tracker-team'

export class ProgressTracker {
  public readonly getTeamsInRange: ProgressTrackerTeam['getTeamsInRange'];
  public readonly getTeamDeliverableInfo: ProgressTrackerDeliverable['getTeamDeliverableInfo'];


  constructor(httpClient: HttpClient) {
    this.getTeamsInRange = new ProgressTrackerTeam(httpClient).getTeamsInRange;
    this.getTeamDeliverableInfo = new ProgressTrackerDeliverable(httpClient).getTeamDeliverableInfo;
  }
}