import { HttpHelper } from '@/helpers/http.helper';
import { HttpClient } from '@/http-client';
import { RSIError } from '@/errors';
import { createLogger } from '@/logger';
import { CheerioAPI, load } from 'cheerio';
import { RSIUserNotFoundError } from './errors';
import
{
  RSIAffiliationOrganization,
  RSIMainOrganization,
  RSIUserOrganization,
  RSIUserProfile
} from './interfaces';

/**
 * User class for retrieving Star Citizen user information
 * @see https://robertsspaceindustries.com/citizens/{handle}
 */
export class Users
{
  private readonly urlProfile = 'https://robertsspaceindustries.com/citizens/{0}';
  private readonly urlAffiliation = 'https://robertsspaceindustries.com/citizens/{0}/organizations';
  private readonly httpClient: HttpClient;
  private readonly logger = createLogger(Users.name);

  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  private encodeHandle(handle: string): string
  {
    if (!/^[a-zA-Z0-9_\\-]{1,60}$/.test(handle))
      throw new Error(`Invalid user handle: "${handle}"`);
    return encodeURIComponent(handle);
  }

  public async getProfile(userHandle: string): Promise<RSIUserProfile | null>
  {
    this.logger.info('Fetching user profile', { userHandle });

    // Format URL
    const url = this.urlProfile.replace('{0}', this.encodeHandle(userHandle));

    // Request website
    const response = await this.httpClient.get<string>(url);
    if (response.status === 404)
      throw new RSIUserNotFoundError(userHandle);

    if (response.status !== 200)
      throw new RSIError(`Failed to retrieve user profile data from ${url}`);

    // Get HTML contents
    const $ = load(response.data);

    const enlistedDate = new Date($('.label:contains("Enlisted")').next().text().trim());
    const hasBadge = $('.info').first().find('p').last().find('.value').text().trim().length > 0;

    return {
      meta: {
        url
      },
      id: $('.label:contains("UEE Citizen Record")').next().text().trim(),
      display: $('.info').first().find('p').first().find('.value').text().trim(),
      handle: $('.label:contains("Handle name")').next().text().trim(),
      badge: hasBadge ? {
        name: $('.info').first().find('p').last().find('.value').text().trim(),
        image: HttpClient.toAbsoluteUrl($('.info').first().find('.entry').find('.icon').find('img').attr('src'))
      } : undefined,
      image: HttpClient.toAbsoluteUrl($('.title:contains("Profile")').next().find('.thumb').find('img').attr('src')),
      enlisted: (isNaN(enlistedDate.getTime()) ? undefined : enlistedDate.toISOString()),
      location: this.extractProfileLocations($),
      fluency: this.extractProfileFluency($),
      website: $('.label:contains("Website")').next().attr('href'),
      bio: {
        text: HttpHelper.toStringOrUndefined($('.label:contains("Bio")').next().text()?.trim() ?? undefined),
        html: $('.label:contains("Bio")').next().html()?.trim() ?? undefined
      }
    };
  }
  /**
   * Get user affiliations
   *
   * @param userHandle - The user handle
   * @returns The user affiliations
   */
  public async getOrganization(userHandle: string): Promise<RSIUserOrganization | null>
  {
    this.logger.info('Fetching user organizations', { userHandle });

    // Format URL
    const url = this.urlAffiliation.replace('{0}', this.encodeHandle(userHandle));

    // Request website
    const response = await this.httpClient.get<string>(url);
    if (response.status === 404)
      throw new RSIUserNotFoundError(userHandle);

    if (response.status !== 200)
      throw new RSIError(`Failed to retrieve user organization data from ${url}`);

    // Get HTML contents
    const $ = load(response.data);

    const mainOrg = $('.org.main');
    const organization: RSIMainOrganization = {
      info: {
        meta: {
          url: HttpClient.toAbsoluteUrl($(mainOrg).find('.info .entry').first().find('a').attr('href'))
        },
        sid: $(mainOrg).find('.label:contains("SID")').next().text().trim(),
        name: $(mainOrg).find('.info .entry').first().text().trim(),
        rank: $(mainOrg).find('.label:contains("rank")').next().text().trim(),
        stars: $(mainOrg).find('.ranking span.active').length,
        image: HttpClient.toAbsoluteUrl($(mainOrg).find('img').attr('src')),
        members: Number(/\d+/.exec($(mainOrg).find('.members').text().trim())?.at(0) ?? NaN)
      },
      characteristics: {
        archetype: $(mainOrg).find('.label:contains("Archetype")').next().text().trim(),
        primaryLanguage: $(mainOrg).find('.label:contains("Prim. Language")').next().text().trim(),
        primaryActivity: $(mainOrg).find('.label:contains("Prim. Activity")').next().text().trim(),
        recruiting: $(mainOrg).find('.label:contains("Recruiting")').next().text().trim() === 'Yes',
        sectorOfActivity: $(mainOrg).find('.label:contains("Sec. Activity")').next().text().trim(),
        roleplay: $(mainOrg).find('.label:contains("Role Play")').next().text().trim() === 'Yes',
        commitment: $(mainOrg).find('.label:contains("Commitment")').next().text().trim(),
        exclusive: $(mainOrg).find('.label:contains("Exclusive")').next().text().trim() === 'Yes'
      }
    };

    // Extract affiliations
    const affiliations = this.extractAffiliations($);
    return {
      organization,
      affiliations
    };
  }

  private extractAffiliations($: CheerioAPI): RSIAffiliationOrganization[]
  {
    const affiliations: RSIAffiliationOrganization[] = [];
    $('.org.affiliation').each((_, affiliation) =>
    {
      // check if the affiliation is restricted
      if ($(affiliation).find('.restriction').length > 0)
        return;

      const name = $(affiliation).find('.entry.orgtitle').text().trim();
      const sid = $(affiliation).find('.label:contains("SID")').next().text().trim();
      const rank = $(affiliation).find('.label:contains("rank")').next().text().trim();
      const image = HttpClient.toAbsoluteUrl($(affiliation).find('img').attr('src')?.trim());
      const stars = $(affiliation).find('.ranking span.active').length;
      const members = Number(/\d+/.exec($(affiliation).find('.members').text().trim())?.at(0) ?? NaN);

      affiliations.push({
        sid,
        name,
        rank,
        stars,
        members,
        image
      });
    });

    return affiliations;
  }

  private extractProfileLocations($: CheerioAPI): RSIUserProfile['location']
  {
    const text = $('.label:contains("Location")').next().text().trim();
    if (text == null || text == '')
      return undefined;

    const parts = text.split(',');

    return {
      country: parts.at(0)?.trim(),
      region: parts.at(1)?.trim()
    };
  }

  private extractProfileFluency($: CheerioAPI): RSIUserProfile['fluency']
  {
    const text = $('.label:contains("Fluency")').next().text().trim();
    if (text == null || text == '')
      return [];

    const parts = text.split(',');
    return parts.map(x => x.trim());
  }
}
