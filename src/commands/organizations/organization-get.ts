import { HttpClient } from '@/http-client';
import { AxiosError } from 'axios';
import { load } from 'cheerio';
import { RSIOrganizationDetail } from './types';

type ReturnFunction = (sid: string) => Promise<RSIOrganizationDetail>;

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
    throw new AxiosError(`HTTP request failed while retrieving stats data, status code: ${error.response?.status}`, 'HTTP_ERROR');
  }
}

function validateSid(sid: string): string
{
  if (!/^[a-zA-Z0-9_\\-]{3,10}$/.test(sid))
    throw new Error(`Invalid organization SID: "${sid}"`);
  return encodeURIComponent(sid);
}

export function get(httpClient: HttpClient): ReturnFunction
{
  const urlOrganization = 'https://robertsspaceindustries.com/orgs/{0}';

  return async function (sid: string): Promise<RSIOrganizationDetail>
  {
    const url = urlOrganization.replace('{0}', validateSid(sid));
    const response = await httpClient.get<string>(url).catch(handleError);
    if (!response)
    {
      throw new Error(`Failed to get response for organization ${sid}`);
    }

    // Get HTML contents
    const $ = load(response.data);
    const heading = $('.heading');
    const content = $('.content-wrapper > .content');
    if (heading.length === 0)
      throw new Error(`Failed to find organization heading for ${sid}`);

    return {
      url,
      sid,
      name: heading.find('.inner h1').text().match(/^[^/]+/)?.[0].trim(),
      logo: HttpClient.toAbsoluteUrl(heading.find('.logo img').attr('src')),
      banner: HttpClient.toAbsoluteUrl(heading.find('.banner img').attr('src')),
      membersCount: parseInt(heading.find('.logo .count').text().replace(/\D/g, '')),
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
