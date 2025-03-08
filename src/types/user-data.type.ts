import { UserProfile } from './user-profile.type';
import { UserOrganization } from './user-organization.type';
import { UserAffiliation } from './user-affiliation.type';

export type UserData = {
  profile: UserProfile;
  organization: UserOrganization;
  affiliation: UserAffiliation[];
}
