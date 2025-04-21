import { CheerioAPI, load } from 'cheerio';
import { HttpClient } from '../../http-client';
import
{
  RSIAffiliationOrganization, RSIMainOrganization,
  RSIUserOrganization,
  RSIUserProfile
} from './types';

/**
 * User class for retrieving Star Citizen user information
 * @see https://robertsspaceindustries.com/citizens/{handle}
 */
export class User
{
  private readonly urlProfile = 'https://robertsspaceindustries.com/citizens/{0}';
  private readonly urlAffiliation = 'https://robertsspaceindustries.com/citizens/{0}/organizations';
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient)
  {
    this.httpClient = httpClient;
  }


  public async getProfile(userHandle: string): Promise<RSIUserProfile | null>
  {
    // Format URL
    const url = this.urlProfile.replace('{0}', userHandle);

    // Request website
    const response = await this.httpClient.get<string>(url);
    if (response.status === 404)
      return null;

    if (response.status !== 200)
      return null;

    // Get HTML contents
    const $ = load(response.data);

    return {
      page: {
        url,
        title: $('title').text().trim()
      },
      id: $('.label:contains("UEE Citizen Record")').next().text().trim(),
      display: $('.info').first().find('p').first().find('.value').text().trim(),
      handle: $('.label:contains("Handle name")').next().text().trim(),
      badge: $('.info').first().find('p').last().find('.value').text().trim(),
      badge_image: $('.info').first().find('.entry').find('.icon').find('img').attr('src'),
      image: $('.title:contains("Profile")').next().find('.thumb').find('img').attr('src'),
      enlisted: $('.label:contains("Enlisted")').next().text().trim(),
      location: this.extractProfileLocations($),
      fluency: this.extractProfileFluency($),
      website: $('.label:contains("Enlisted")').next().attr('href'),
      bio: {
        text: $('.label:contains("Bio")').next().text().trim(),
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
    // Format URL
    const url = this.urlAffiliation.replace('{0}', userHandle);

    // Request website
    const response = await this.httpClient.get<string>(url);
    if (response.status === 404)
      return null;

    if (response.status !== 200)
      return null;

    // Get HTML contents
    const $ = load(response.data);

    const mainOrg = $('.org.main');
    const organization: RSIMainOrganization = {
      info: {
        url: HttpClient.toAbsoluteUrl($(mainOrg).find('.info .entry').first().find('a').attr('href')),
        sid: $(mainOrg).find('.label:contains("SID")').next().text().trim(),
        name: $(mainOrg).find('.info .entry').first().text().trim(),
        rank: $(mainOrg).find('.label:contains("rank")').next().text().trim(),
        stars: $(mainOrg).find('.ranking span.active').length,
        image: $(mainOrg).find('img').attr('src'),
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
