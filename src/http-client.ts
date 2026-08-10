import axios, {
  AxiosInstance, AxiosRequestConfig, AxiosResponse
} from 'axios';
import { HttpProxyAgent } from 'http-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import packageJSON from '../package.json';

/**
 * Configuration options for the RSI Scraper
 */
export interface HttpConfigOptions
{
  /** HTTP proxy to use for requests */
  httpProxy?: string;
  /** HTTPS proxy to use for requests */
  httpsProxy?: string;
  /** User agent string */
  userAgent?: string;
  /** No proxy list */
  noProxy?: string;
}

/**
 * A module to perform HTTP requests
 */
/**
 * Http client for making requests to the Roberts Space Industries (RSI) website.
 *
 * This client handles web requests with features including:
 * - Automatic proxy configuration from environment variables
 * - Support for HTTP, HTTPS, and SOCKS proxies
 * - NO_PROXY pattern matching to bypass proxies for specific domains
 * - Configurable user agent and timeout settings
 * - Type-safe request/response handling
 *
 * @example
 * ```typescript
 * // Create a client with default settings (reads from environment variables)
 * const client = new HttpClient();
 *
 * // Or with custom configuration
 * const client = new HttpClient({
 *   httpProxy: 'http://proxy:8080',
 *   userAgent: 'MyCustomApp/1.0'
 * });
 *
 * // Make a request to RSI
 * const response = await client.get<ApiResponse>('/api/endpoint');
 * ```
 *
 * Environment variables:
 * - HTTP_PROXY/http_proxy: Proxy for HTTP requests
 * - HTTPS_PROXY/https_proxy: Proxy for HTTPS requests
 * - NO_PROXY/no_proxy: Comma-separated list of domains to bypass proxy
 * - USER_AGENT: Custom user agent string
 */
export class HttpClient
{
  public static readonly host = 'https://robertsspaceindustries.com';
  private readonly axiosInstance: AxiosInstance;
  public readonly config: HttpConfigOptions;

  constructor(config?: Partial<HttpConfigOptions>)
  {
    // Use createConfig to automatically apply environment variable settings
    this.config = this.createConfig(config);
    this.axiosInstance = this.configureAxios();
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
      console.warn(`Failed to parse URL for proxy check: ${url}`, error);
    }

    return true; // Use proxy by default
  }

  /**
   * Configure axios instance with default settings and proxy
   */
  private configureAxios(): AxiosInstance
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
      timeout: 5000
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
          console.error('Error creating proxy agent:', error);
        }
      }

      return config;
    });

    // Add a response interceptor to handle errors
    instance.interceptors.response.use((response) =>
    {
      if (response.data == null)
        throw new Error('HTTP request failed, no data received');

      return response;
    });

    return instance;
  }

  /**
   * Send a GET request
   */
  public async get<T>(
    url: string,
    headers?: Record<string, string>
  ): Promise<AxiosResponse<T>>
  {
    return this.axiosInstance.get<T>(url, { headers });
  }

  /**
   * Send a POST request
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
   * Send a PUT request
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
   * Send a DELETE request
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
   * // Assuming HttpClient.host is "https://example.com"
   * HttpClient.toAbsoluteUrl("/api/users");                    // Returns "https://example.com/api/users"
   * HttpClient.toAbsoluteUrl("https://example.com/api/users"); // Returns "https://example.com/api/users"
   * HttpClient.toAbsoluteUrl(undefined);                       // Returns undefined
   */
  public static toAbsoluteUrl(path?: string): string | undefined
  {
    if (path == null)
      return undefined;

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
