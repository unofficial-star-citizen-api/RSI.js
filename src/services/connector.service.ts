import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { URL } from 'url';
import { config } from './config';
import packageJSON from '../../package.json';
import { SocksProxyAgent } from 'socks-proxy-agent';

/**
 * A module to perform requests
 */
export class Connector {
  public static readonly urlHost = 'https://robertsspaceindustries.com';
  private readonly userAgent: string;

  constructor() {
    const version = packageJSON.version || 'DEVELOPMENT';
    this.userAgent = config.userAgent ||
      `StarCitizen REST API/${version} (starcitizen-api.com)`;
  }

  /**
   * Send a request to the specified url using parameters
   *
   * @param url - The URL
   * @param jsonData - The data to send
   * @param headers - Headers parameters
   * @param method - Use the "get" or "post"
   * @returns The Response object
   */
  public async request<T>(
    url: string,
    jsonData: Record<string, unknown> | null = null,
    headers: Record<string, string> = {},
    method: 'get' | 'post' = 'post'
  ): Promise<AxiosResponse<T>> {
    headers = {
      'Accept-Language': 'en-US,en;q=0.5',
      'User-Agent': this.userAgent,
      'Cache-Control': 'no-cache',
      'Cookie': 'Rsi-Token=',
      ...headers
    };

    const axiosConfig: AxiosRequestConfig = {
      url,
      method,
      headers,
      timeout: 5000
    };

    if (config.httpsProxy) {
      axiosConfig.httpsAgent = new SocksProxyAgent(config.httpsProxy);
    }

    if (config.httpProxy) {
      axiosConfig.httpAgent = new SocksProxyAgent(config.httpProxy);
    }

    if (jsonData !== null) {
      axiosConfig.data = jsonData;
    }

    return await axios.request<T>(axiosConfig);
  }

  /**
   * Converts a relative path to an absolute URL
   *
   * @param path - The path to convert
   * @returns The absolute URL
   */
  public static convertPath(path: string): string {
    return new URL(path, Connector.urlHost).toString();
  }
}
