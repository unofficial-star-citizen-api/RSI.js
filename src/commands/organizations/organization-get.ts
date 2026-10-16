import { HttpClient } from '@/http-client';
import { RSIError } from '@/errors';
import { AxiosError } from 'axios';
import { load } from 'cheerio';
import { RSIOrganizationNotFoundError } from './errors';
import { RSIOrganization } from './interfaces';

type ReturnFunction = (sid: string) => Promise<RSIOrganization>;

export function handleError(error: AxiosError): void
{
  const sid = error.config?.url?.split('/').pop() ?? 'unknown';
  if (error.response?.status === 404)
  {
    error.message = `Organization "${sid}" not found`;
    throw error;
  }
  else if (error.response?.status !== 200)
  {
    throw new AxiosError(`HTTP request failed while retrieving organization data for "${sid}", status code: ${error.response?.status}`, error.code, error.config, error.request, error.response);
  }
}

export function get(httpClient: HttpClient): ReturnFunction
{
  const urlOrganization = 'https://robertsspaceindustries.com/orgs/{0}';

  return async function (sid: string): Promise<RSIOrganization>
  {
    const url = urlOrganization.replace('{0}', sid);
    const response = await httpClient.get<string>(url).catch(handleError);
    if (!response)
    {
      throw new RSIError(`Failed to get response for organization ${sid}`);
    }

    if (response.status === 404)
      throw new RSIOrganizationNotFoundError(sid);

    // Get HTML contents
    const $ = load(response.data);
    const heading = $('.heading');
    const content = $('.content-wrapper > .content');
    if (heading.length === 0)
      throw new RSIError(`Failed to find organization heading for ${sid}`);

    const symbol = heading.find('.symbol').text().trim();

    return {
      meta: {
        url: urlOrganization.replace('{0}', symbol)
      },
      sid: symbol,
      name: heading.find('.inner h1').text().match(/^[^/]+/)?.[0].trim(),
      logo: HttpClient.toAbsoluteUrl(heading.find('.logo img').attr('src')),
      banner: HttpClient.toAbsoluteUrl(heading.find('.banner img').attr('src')),
      membersCount: parseInt(heading.find('.logo .count').text().replace(/\D/g, '')),
      archetype: heading.find('.tags.clearfix .model').text().trim(),
      commitment: heading.find('.tags.clearfix .commitment').text().trim(),

      focus: {
        primary: {
          image: HttpClient.toAbsoluteUrl(heading.find('.primary.tooltip-wrap img').attr('src')),
          name: heading.find('.primary.tooltip-wrap img').attr('alt')
        },
        secondary: {
          image: HttpClient.toAbsoluteUrl(heading.find('.secondary.tooltip-wrap img').attr('src')),
          name: heading.find('.secondary.tooltip-wrap img').attr('alt')
        }
      },

      headline: {
        html: content.find('.body').html() ?? undefined,
        plaintext: content.find('.body').text()
      },
      history: {
        html: content.find('#tab-history').html() ?? undefined,
        plaintext: content.find('#tab-history').text()
      },
      manifesto: {
        html: content.find('#tab-manifesto').html() ?? undefined,
        plaintext: content.find('#tab-manifesto').text()
      },
      charter: {
        html: content.find('#tab-charter').html() ?? undefined,
        plaintext: content.find('#tab-charter').text()
      }
    };
  };
}
