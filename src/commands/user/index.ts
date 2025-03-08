import { load } from 'cheerio';
import { HttpClient } from '../../http-client';
import { UserAffiliation, UserData } from '@types';

/**
 * User class for retrieving Star Citizen user information
 */
export class User {
  private readonly urlProfile = "https://robertsspaceindustries.com/citizens/{0}";
  private readonly urlAffiliation = "https://robertsspaceindustries.com/citizens/{0}/organizations";
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Execute the command to retrieve user information
   */

  /**
   * Get the user profile
   *
   * @param userHandle - The user handle
   * @returns The user info
   */
  public async getUserInfo(userHandle: string): Promise<UserData | null> {
    // Format URL
    const url = this.urlProfile.replace('{0}', userHandle);

    // Request website
    const req = await this.httpClient.get<string>(url);

    if (req === null) {
      return null;
    } else if (req.status === 404) {
      return {
        profile: {
          page: { url: '', title: '' }
        },
        organization: {},
        affiliation: []
      };
    } else if (req.status !== 200) {
      return null;
    }

    // Get HTML contents
    const $ = load(req.data);

    // Begin store basic data
    const result: UserData = {
      profile: {
        page: {
            url,
            title: $('title').text().trim()
        }
      },
      organization: {},
      affiliation: []
    };

    // Get identifier
    result.profile.id = $('.label:contains("UEE Citizen Record")').next().text().trim();

    // Get displayed name
    result.profile.display = $('.info').first().find('p').first().find('.value').text().trim();

    // Get handle
    result.profile.handle = $('.label:contains("Handle name")').next().text().trim();

    // Get badge
    result.profile.badge = $('.info').first().find('p').last().find('.value').text().trim();

    // Get badge image
    const badgeImg = $('.info').first().find('.entry').find('.icon').find('img').attr('src');
    if (badgeImg) {
      result.profile.badge_image = badgeImg.startsWith('/') ?
        `https://robertsspaceindustries.com${badgeImg}` : badgeImg;
    }

    // Get profile image
    const profileImg = $('.title:contains("Profile")').next().find('.thumb').find('img').attr('src');
    if (profileImg) {
      result.profile.image = HttpClient.convertPath(profileImg.trim());
    }

    // Get organization image
    const orgImg = $('.title:contains("Main organization")').next().find('.thumb').find('a').find('img').attr('src');
    if (orgImg) {
      result.organization.image = HttpClient.convertPath(orgImg.trim());
    }

    // Get organization name
    result.organization.name = $('a.value.data').text().trim();

    // Get organization SID (Spectrum Identification)
    result.organization.sid = $('.label:contains("Spectrum Identification (SID)")').next().text().trim();

    // Get organization rank
    result.organization.rank = $('.label:contains("Organization rank")').next().text().trim();

    // Get organization stars
    result.organization.stars = $('.ranking').find('span.active').length;

    // Get enlist date
    const enlistedDate = $('.label:contains("Enlisted")').next().text().trim();
    if (enlistedDate) {
      const date = new Date(enlistedDate);
      result.profile.enlisted = date.toISOString();
    }

    // Find country and/or region
    const locationText = $('.label:contains("Location")').next('.value').text().trim();
    if (locationText) {
      result.profile.location = {};
      if (locationText.includes(",")) {
        const [country, region] = locationText.split(",");
        result.profile.location.country = country.trim();
        result.profile.location.region = region.trim();
      } else {
        result.profile.location.country = locationText;
      }
    }

    // Get fluency
    const fluencyText = $('.label:contains("Fluency")').next().text().trim();
    if (fluencyText) {
      result.profile.fluency = fluencyText.split(",").map(x => x.trim());
    }

    // Get website
    result.profile.website = $('.label:contains("Website")').next().text().trim();

    // Get bio
    let bioText = '';
    $('.label:contains("Bio")').next('.value').contents().each((_, el) => {
      bioText += $(el).text();
    });
    result.profile.bio = bioText.trim();

    // Remove useless bio
    if (result.profile.bio === '') {
      delete result.profile.bio;
    }

    // Get affiliations
    result.affiliation = await this._getUserAffiliations(userHandle);

    return result;
  }

  /**
   * Get user affiliations
   *
   * @param userHandle - The user handle
   * @returns The user affiliations
   */
  private async _getUserAffiliations(userHandle: string): Promise<UserAffiliation[]> {
    // Format URL
    const url = this.urlAffiliation.replace('{0}', userHandle);

    // Request website
    const req = await this.httpClient.get<string>(url);

    if (req === null) {
      return [];
    } else if (req.status === 404) {
      return [];
    } else if (req.status !== 200) {
      return [];
    }

    // Get HTML contents
    const $ = load(req.data);

    // Store basic data
    const result: UserAffiliation[] = [];

    $('.affiliation').each((_, affiliation) => {
      const aff: UserAffiliation = {};

      aff.sid = $(affiliation).find('.entry strong:has(+ span:contains("SID"))').text().trim();
      aff.name = $(affiliation).find('.orgtitle a').text().trim();
      aff.rank = $(affiliation).find('.entry strong:has(+ span:contains("rank"))').text().trim();
      aff.stars = $(affiliation).find('.ranking span.active').length;

      const imgSrc = $(affiliation).find('img').attr('src');
      if (imgSrc) {
        aff.image = HttpClient.convertPath(imgSrc.trim());
      }

      result.push(aff);
    });

    return result;
  }
}
