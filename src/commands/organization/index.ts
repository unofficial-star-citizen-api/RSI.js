import { HttpClient } from 'src/http-client'
import { OrganizationMembers } from './organization-member'
import { OrganizationSearch } from './organization-search'

export class Organization {
  public readonly findOrganization: OrganizationSearch['findOrganization'];
  public readonly getOrganizationMembers: OrganizationMembers['getOrganizationMembers'];

  constructor(httpClient: HttpClient) {
    this.findOrganization = new OrganizationSearch(httpClient).findOrganization;
    this.getOrganizationMembers = new OrganizationMembers(httpClient).getOrganizationMembers;
  }
}