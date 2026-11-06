import { RSIError } from '@/errors';
import { RSIProgressTrackerTeamNotFoundError } from '../errors';

type GraphQLErrors = { message: string; extensions?: { details?: Record<string, unknown>; }; }[] | undefined;

/** @hidden */
export class ProgressTrackerHelper
{
  /**
   * Throw when the GraphQL response carries top-level errors.
   * RSI rejects an unknown team slug with a validation error on `teamSlug`, which is mapped to a not-found error.
   */
  public static assertNoErrors(errors: GraphQLErrors, label: string, teamSlug?: string): void
  {
    if (!errors?.length)
      return;

    if (teamSlug !== undefined && errors.some(error => error.extensions?.details?.teamSlug !== undefined))
      throw new RSIProgressTrackerTeamNotFoundError(teamSlug);

    throw new RSIError(`${label} data retrieval failed: API returned errors: ${JSON.stringify(errors)}`);
  }
}
