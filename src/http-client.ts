import axios, {
  AxiosInstance, AxiosRequestConfig, AxiosResponse
} from 'axios';
import { HttpProxyAgent } from 'http-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import packageJSON from '../package.json';
import { RSIError } from './errors';
import { createLogger, Logger } from './logger';

/**
 * HTTP options for the client, passed as {@link RSIConfig.httpConfig}.
 *
 * In Node.js, each unset option falls back to an environment variable.
 * Values passed in code take precedence.
 *
 * | Variable       | Option       |
 * |----------------|--------------|
 * | `HTTP_PROXY`   | `httpProxy`  |
 * | `HTTPS_PROXY`  | `httpsProxy` |
 * | `NO_PROXY`     | `noProxy`    |
 * | `USER_AGENT`   | `userAgent`  |
 * | `HTTP_TIMEOUT` | `timeout`    |
 *
 * Proxy options only apply in Node.js.
 *
 * @category Configuration
 */
export interface HttpConfigOptions
{
  /**
   * Proxy for `http://` requests, for example `http://proxy:8080` or `socks5://localhost:5566`.
   */
  httpProxy?: string;

  /**
   * Proxy for `https://` requests. Every RSI endpoint is HTTPS, so this is the one that usually matters.
   * `http(s)://` and `socks://` proxy URLs are supported.
   */
  httpsProxy?: string;

  /**
   * Comma-separated hostnames that bypass the proxy.
   * Supports exact hosts, `*.domain` and `.domain`, for example `localhost,*.internal`.
   */
  noProxy?: string;

  /**
   * `User-Agent` header sent with every request.
   * @default `StarCitizen REST API/<package version> (starcitizen-api.com)`
   */
  userAgent?: string;

  /**
   * Request timeout in milliseconds.
   * @default 15000
   */
  timeout?: number;
}

/**
 * HTTP client used by every module to call robertsspaceindustries.com, built on axios.
 *
 * You don't normally create one yourself: {@link RSI} creates it from {@link RSIConfig.httpConfig}
 * and exposes it as {@link RSI.httpClient}.
 *
 * - Picks an HTTP, HTTPS or SOCKS proxy agent per request, honouring `noProxy`.
 * - Never throws on an HTTP status: callers inspect `response.status`.
 * - Logs requests and responses when logging is enabled.
 *
 * @category Configuration
 *
 * @example
 * ```typescript
 * import { HttpClient } from '@unofficial-star-citizen-api/rsi.js';
 *
 * // Default settings, completed from environment variables
 * const client = new HttpClient();
 *
 * // Custom settings
 * const proxied = new HttpClient({
 *   httpsProxy: 'socks5://localhost:5566',
 *   userAgent: 'MyBot/1.0',
 * });
 *
 * const response = await proxied.get<string>(HttpClient.toAbsoluteUrl('/citizens/Dymerz')!);
 * console.log(response.status);
 * ```
 */
export class HttpClient
{
  /** Base URL of the RSI website */
  public static readonly host = 'https://robertsspaceindustries.com';
  private readonly axiosInstance: AxiosInstance;
  private readonly logger: Logger;
  /** Effective configuration: constructor options merged over environment variables */
  public readonly config: HttpConfigOptions;

  /**
   * @param config - HTTP options; unset fields fall back to environment variables
   */
  constructor(config?: Partial<HttpConfigOptions>)
  {
    // Use createConfig to automatically apply environment variable settings
    this.config = this.createConfig(config);
    this.logger = createLogger(HttpClient.name);
    this.axiosInstance = this.configureAxios(config?.timeout);
  }

  /**
   * Checks if a URL should use proxy based on NO_PROXY settings
   * @param url The URL to check
   * @returns true if proxy should be used, false if it should be bypassed
   */
  private shouldUseProxy(url: string): boolean
  {
    if (!this.config.noProxy)
      return true;

    try
    {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;

      // Split the noProxy string into an array of domains/IPs
      const noProxyList = this.config.noProxy.split(',').map(item => item.trim());

      // Check if hostname matches any entry in the noProxyList
      for (const noProxyItem of noProxyList)
      {
        // Check for direct match or wildcard match (e.g., *.example.com)
        if (
          hostname === noProxyItem ||
          (noProxyItem.startsWith('*.') && hostname.endsWith(noProxyItem.substring(1))) ||
          (noProxyItem.startsWith('.') && hostname.endsWith(noProxyItem))
        )
        {
          return false; // Should bypass proxy
        }
      }
    } catch (error)
    {
      // If URL parsing fails, default to using proxy
      this.logger.warn(
        `Failed to parse URL for proxy check: ${url}`,
        error instanceof Error ? error.message : String(error)
      );
    }

    return true; // Use proxy by default
  }

  /**
   * Configure axios instance with default settings and proxy
   */
  private configureAxios(timeout?: number): AxiosInstance
  {
    const version = packageJSON.version ?? 'DEVELOPMENT';
    const userAgent = this.config.userAgent ?? `StarCitizen REST API/${version} (starcitizen-api.com)`;

    const axiosConfig: AxiosRequestConfig = {
      headers: {
        'Accept-Language': 'en-US,en;q=0.5',
        'User-Agent': userAgent,
        'Cache-Control': 'no-cache',
        'Cookie': 'Rsi-Token='
      },
      timeout: timeout ?? 15_000,
      // Never reject on HTTP status, commands inspect `response.status` and throw RSIError themselves
      validateStatus: () => true
    };

    // Create axios instance
    const instance = axios.create(axiosConfig);

    // Add request interceptor to conditionally apply proxy based on URL
    instance.interceptors.request.use((config) =>
    {
      if (!config.url)
      {
        return config;
      }

      this.logger.info('HTTP request', {
        method: config.method?.toUpperCase() ?? 'GET',
        url: config.url
      });

      // Determine whether to use proxy for this request
      const useProxy = this.shouldUseProxy(config.url);

      if (useProxy)
      {
        try
        {
          const createProxyAgent = (proxyUrl: string, targetProtocol: string) =>
          {
            const proxyUrlObj = new URL(proxyUrl);
            const protocol = proxyUrlObj.protocol.toLowerCase();

            // Handle different proxy protocols
            if (protocol.startsWith('socks'))
            {
              return new SocksProxyAgent(proxyUrl);
            } else if (targetProtocol === 'https:')
            {
              return new HttpsProxyAgent(proxyUrl);
            } else
            {
              return new HttpProxyAgent(proxyUrl);
            }
          };

          // Apply proxy settings based on target URL protocol
          if (config.url.startsWith('https:') && this.config.httpsProxy)
          {
            config.httpsAgent = createProxyAgent(this.config.httpsProxy, 'https:');
          } else if (config.url.startsWith('http:') && this.config.httpProxy)
          {
            config.httpAgent = createProxyAgent(this.config.httpProxy, 'http:');
          }
        } catch (error)
        {
          this.logger.error(
            'Error creating proxy agent',
            error instanceof Error ? error.message : String(error)
          );
        }
      }

      return config;
    });

    // Add a response interceptor to handle errors
    instance.interceptors.response.use((response) =>
    {
      this.logger.info('HTTP response', {
        method: response.config.method?.toUpperCase() ?? 'GET',
        url: response.config.url,
        status: response.status
      });

      // Only enforce a body on successful responses, error statuses are handled by the caller
      const isSuccess = response.status >= 200 && response.status < 300;
      if (isSuccess && response.data == null)
      {
        const error = new RSIError('HTTP request failed, no data received');
        this.logger.error(error.message);
        throw error;
      }

      return response;
    }, (error: unknown) =>
    {
      this.logger.error(
        'HTTP request failed',
        error instanceof Error ? error.message : String(error)
      );
      return Promise.reject(error);
    });

    return instance;
  }

  /**
   * Send a GET request. Resolves for every HTTP status; check `response.status`.
   *
   * @typeParam T - Expected response body type
   * @param url - Absolute URL to request
   * @param headers - Extra headers, merged over the default ones
   * @returns The axios response
   */
  public async get<T>(
    url: string,
    headers?: Record<string, string>
  ): Promise<AxiosResponse<T>>
  {
    return this.axiosInstance.get<T>(url, { headers });
  }

  /**
   * Send a POST request. Resolves for every HTTP status; check `response.status`.
   *
   * @typeParam T - Expected response body type
   * @param url - Absolute URL to request
   * @param data - Request body, serialized by axios
   * @param headers - Extra headers, merged over the default ones
   * @returns The axios response
   */
  public async post<T>(
    url: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<AxiosResponse<T>>
  {
    return this.axiosInstance.post<T>(url, data, { headers });
  }

  /**
   * Send a PUT request. Resolves for every HTTP status; check `response.status`.
   *
   * @typeParam T - Expected response body type
   * @param url - Absolute URL to request
   * @param data - Request body, serialized as JSON
   * @param headers - Extra headers, merged over the default ones
   * @returns The axios response
   */
  public async put<T>(
    url: string,
    data: Record<string, unknown>,
    headers?: Record<string, string>
  ): Promise<AxiosResponse<T>>
  {
    return this.axiosInstance.put<T>(url, data, { headers });
  }

  /**
   * Send a DELETE request. Resolves for every HTTP status; check `response.status`.
   *
   * @typeParam T - Expected response body type
   * @param url - Absolute URL to request
   * @param headers - Extra headers, merged over the default ones
   * @returns The axios response
   */
  public async delete<T>(
    url: string,
    headers?: Record<string, string>
  ): Promise<AxiosResponse<T>>
  {
    return this.axiosInstance.delete<T>(url, { headers });
  }

  /**
   * Converts a relative path to an absolute URL using the host specified in the HttpClient.
   *
   * @param path - The relative path to convert to an absolute URL. Can be undefined.
   * @returns The absolute URL as a string, or undefined if the path parameter is null or undefined.
   *
   * @example
   * ```typescript
   * HttpClient.toAbsoluteUrl('/citizens/Dymerz');        // 'https://robertsspaceindustries.com/citizens/Dymerz'
   * HttpClient.toAbsoluteUrl('https://example.com/a');   // 'https://example.com/a' (unchanged)
   * HttpClient.toAbsoluteUrl(undefined);                 // undefined
   * ```
   */
  public static toAbsoluteUrl(path?: string): string | undefined
  {
    if (path == null)
      return undefined;

    if (path.startsWith('http://') || path.startsWith('https://'))
      return path;

    return new URL(path, HttpClient.host).toString();
  }

  /**
   * Load configuration from environment variables
   */
  private loadConfigFromEnv(): Partial<HttpConfigOptions>
  {
    const envConfig: Partial<HttpConfigOptions> = {};

    if (typeof process !== 'undefined' && process.env)
    {
      envConfig.httpProxy = process.env.HTTP_PROXY;
      envConfig.httpsProxy = process.env.HTTPS_PROXY;
      envConfig.noProxy = process.env.NO_PROXY;
      envConfig.userAgent = process.env.USER_AGENT;
      envConfig.timeout = process.env.HTTP_TIMEOUT ? parseInt(process.env.HTTP_TIMEOUT, 10) : undefined;
    }

    return envConfig;
  }

  /**
   * Create a configuration object with defaults and environment variables
   */
  private createConfig(options?: Partial<HttpConfigOptions>): HttpConfigOptions
  {
    return {
      ...this.loadConfigFromEnv(),
      ...options
    };
  }
}
