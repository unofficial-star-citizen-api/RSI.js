import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { URL } from 'url';
import { HttpConfigOptions } from './config';
import packageJSON from '../package.json';
import { SocksProxyAgent } from 'socks-proxy-agent';

/**
 * A module to perform HTTP requests
 */
export class HttpClient {
  public static readonly urlHost = 'https://robertsspaceindustries.com';
  private readonly axiosInstance: AxiosInstance;
  public readonly config: HttpConfigOptions;

  constructor(config?: Partial<HttpConfigOptions>) {
    this.config = {
      httpProxy: config?.httpProxy,
      httpsProxy: config?.httpsProxy,
      userAgent: config?.userAgent
    };
    this.axiosInstance = this.configureAxios();
  }

  /**
   * Configure axios instance with default settings and proxy
   */
  private configureAxios(): AxiosInstance {
    const version = packageJSON.version || 'DEVELOPMENT';
    const userAgent = this.config.userAgent ||
      `StarCitizen REST API/${version} (starcitizen-api.com)`;

    const axiosConfig: AxiosRequestConfig = {
      headers: {
        'Accept-Language': 'en-US,en;q=0.5',
        'User-Agent': userAgent,
        'Cache-Control': 'no-cache',
        'Cookie': 'Rsi-Token='
      },
      timeout: 5000
    };

    if (this.config.httpsProxy) {
      axiosConfig.httpsAgent = new SocksProxyAgent(this.config.httpsProxy);
    }

    if (this.config.httpProxy) {
      axiosConfig.httpAgent = new SocksProxyAgent(this.config.httpProxy);
    }

    return axios.create(axiosConfig);
  }

  /**
   * Send a GET request
   */
  public async get<T>(
    url: string,
    headers?: Record<string, string>
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, { headers });
  }

  /**
   * Send a POST request
   */
  public async post<T>(
    url: string,
    data?: Record<string, unknown>,
    headers?: Record<string, string>
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, { headers });
  }

  /**
   * Send a PUT request
   */
  public async put<T>(
    url: string,
    data: Record<string, unknown>,
    headers?: Record<string, string>
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, { headers });
  }

  /**
   * Send a DELETE request
   */
  public async delete<T>(
    url: string,
    headers?: Record<string, string>
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, { headers });
  }

  /**
   * Converts a relative path to an absolute URL
   */
  public static convertPath(path: string): string {
    return new URL(path, HttpClient.urlHost).toString();
  }
}
