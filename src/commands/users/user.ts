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
 * Citizen profiles and organization affiliations, scraped from the public citizen pages.
 * Access it through {@link RSI.users}.
 *
 * Handles must match `[a-zA-Z0-9_-]{1,60}`; anything else throws an `Error` before any request is sent.
 *
 * @category Commands
 * @hideconstructor
 * @see https://robertsspaceindustries.com/citizens/{handle}
 */
export class Users
{
  private readonly urlProfile = 'https://robertsspaceindustries.com/citizens/{0}';
  private readonly urlAffiliation = 'https://robertsspaceindustries.com/citizens/{0}/organizations';
  private readonly httpClient: HttpClient;
  private readonly logger = createLogger(Users.name);

  /** @hidden */
  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }

  private encodeHandle(handle: string): string
  {
    if (!/^[a-zA-Z0-9_-]{1,60}$/.test(handle))
      throw new Error(`Invalid user handle: "${handle}"`);
    return encodeURIComponent(handle);
  }

  /**
   * Get a citizen's public profile: record number, display name, handle, badge, avatar,
   * enlisted date, location, fluency, website and bio.
   *
   * @param userHandle - Citizen handle, for example `Dymerz`
   * @returns The citizen profile
   * @throws Error if the handle is not a valid citizen handle
   * @throws {@link RSIUserNotFoundError} if no citizen has this handle
   * @throws {@link RSIError} if RSI answers with any other non-200 status
   *
   * @example
   * ```typescript
   * import { RSI } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   * const profile = await rsi.users.getProfile('Dymerz');
   *
   * console.log(profile.display, profile.enlisted); // enlisted is an ISO date string
   * console.log(profile.meta.url);                   // https://robertsspaceindustries.com/citizens/Dymerz
   * ```
   */
  public async getProfile(userHandle: string): Promise<RSIUserProfile>
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

    const info = $('.info').first();
    // The badge is the only entry with an icon, it is absent when the citizen has no badge
    const badgeEntry = info.find('.entry').filter((_, entry) => $(entry).find('.icon').length > 0).first();
    const badgeName = badgeEntry.find('.value').text().trim();

    return {
      meta: {
        url
      },
      id: $('.label:contains("UEE Citizen Record")').next().text().trim(),
      display: info.find('p').first().find('.value').text().trim(),
      handle: $('.label:contains("Handle name")').next().text().trim(),
      badge: badgeName ? {
        name: badgeName,
        image: HttpClient.toAbsoluteUrl(badgeEntry.find('.icon img').attr('src'))
      } : undefined,
      image: HttpClient.toAbsoluteUrl($('.title:contains("Profile")').next().find('.thumb').find('img').attr('src')),
      enlisted: this.extractProfileEnlisted($),
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
   * Get a citizen's main organization (with rank, stars and characteristics) and every public affiliation.
   * Redacted (hidden) affiliations are skipped.
   *
   * @param userHandle - Citizen handle, for example `Dymerz`
   * @returns The main organization and the public affiliations
   * @throws Error if the handle is not a valid citizen handle
   * @throws {@link RSIUserNotFoundError} if no citizen has this handle
   * @throws {@link RSIError} if RSI answers with any other non-200 status
   *
   * @example
   * ```typescript
   * import { RSI } from '@unofficial-star-citizen-api/rsi.js';
   *
   * const rsi = new RSI();
   * const result = await rsi.users.getOrganization('Dymerz');
   *
   * console.log(result.organization.info.name, result.organization.info.rank);
   * console.log(result.affiliations.map(org => org.sid));
   * ```
   */
  public async getOrganization(userHandle: string): Promise<RSIUserOrganization>
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
    const organization: RSIMainOrganization = (mainOrg.length === 0 || mainOrg.find('.restriction').length > 0)
      ? this.emptyMainOrganization()
      : this.extractMainOrganization(mainOrg);

    // Extract affiliations
    const affiliations = this.extractAffiliations($);
    return {
      organization,
      affiliations
    };
  }

  /** Main organization with every field undefined, used when it is redacted or the citizen has none */
  private emptyMainOrganization(): RSIMainOrganization
  {
    return {
      info: {
        meta: { url: undefined },
        sid: undefined,
        name: undefined,
        rank: undefined,
        stars: undefined,
        image: undefined,
        members: undefined
      },
      characteristics: {
        archetype: undefined,
        primaryLanguage: undefined,
        primaryActivity: undefined,
        recruiting: undefined,
        sectorOfActivity: undefined,
        roleplay: undefined,
        commitment: undefined,
        exclusive: undefined
      }
    };
  }

  private extractMainOrganization(mainOrg: ReturnType<CheerioAPI>): RSIMainOrganization
  {
    return {
      info: {
        meta: {
          url: HttpClient.toAbsoluteUrl(mainOrg.find('.info .entry').first().find('a').attr('href'))
        },
        sid: mainOrg.find('.label:contains("SID")').next().text().trim(),
        name: mainOrg.find('.info .entry').first().text().trim(),
        rank: mainOrg.find('.label:contains("rank")').next().text().trim(),
        stars: mainOrg.find('.ranking span.active').length,
        image: HttpClient.toAbsoluteUrl(mainOrg.find('img').attr('src')),
        members: Number(/\d+/.exec(mainOrg.find('.members').text().trim())?.at(0) ?? NaN)
      },
      characteristics: {
        archetype: mainOrg.find('.label:contains("Archetype")').next().text().trim(),
        primaryLanguage: mainOrg.find('.label:contains("Prim. Language")').next().text().trim(),
        primaryActivity: mainOrg.find('.label:contains("Prim. Activity")').next().text().trim(),
        recruiting: mainOrg.find('.label:contains("Recruiting")').next().text().trim() === 'Yes',
        sectorOfActivity: mainOrg.find('.label:contains("Sec. Activity")').next().text().trim(),
        roleplay: mainOrg.find('.label:contains("Role Play")').next().text().trim() === 'Yes',
        commitment: mainOrg.find('.label:contains("Commitment")').next().text().trim(),
        exclusive: mainOrg.find('.label:contains("Exclusive")').next().text().trim() === 'Yes'
      }
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

  private extractProfileEnlisted($: CheerioAPI): RSIUserProfile['enlisted']
  {
    // RSI shows a calendar date ("Aug 19, 2016"), read it as UTC midnight so the result does not depend on the local timezone
    const date = new Date($('.label:contains("Enlisted")').next().text().trim());
    if (isNaN(date.getTime()))
      return undefined;

    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString();
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
