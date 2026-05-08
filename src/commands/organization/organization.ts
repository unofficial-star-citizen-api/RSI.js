import { HttpClient } from '@/http-client';
import { get as getFunction } from './organization-get';
import { search as searchFunction } from './organization-search';
import { searchMembers as searchMembersFunction } from './organization-search-members';

export class Organization
{
  public readonly get: ReturnType<typeof getFunction>;
  public readonly search: ReturnType<typeof searchFunction>;
  public readonly searchMembers: ReturnType<typeof searchMembersFunction>;

  constructor(httpClient: HttpClient)
  {
    this.get = getFunction(httpClient);
    this.search = searchFunction(httpClient);
    this.searchMembers = searchMembersFunction(httpClient);
  }
}