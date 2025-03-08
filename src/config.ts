/**
 * Configuration options for the RSI Scraper
 */
export interface HttpConfigOptions {
  /** HTTP proxy to use for requests */
  httpProxy?: string;
  /** HTTPS proxy to use for requests */
  httpsProxy?: string;
  /** User agent string */
  userAgent?: string;
}

/**
 * Load configuration from environment variables
 */
export function loadConfigFromEnv(): Partial<HttpConfigOptions> {
  const envConfig: Partial<HttpConfigOptions> = {};

  if (typeof process !== 'undefined' && process.env) {
    if (process.env.HTTP_PROXY) envConfig.httpProxy = process.env.HTTP_PROXY;
    if (process.env.HTTPS_PROXY) envConfig.httpsProxy = process.env.HTTPS_PROXY;
    if (process.env.USER_AGENT) envConfig.userAgent = process.env.USER_AGENT;
  }

  return envConfig;
}

/**
 * Create a configuration object with defaults and environment variables
 */
export function createConfig(options?: Partial<HttpConfigOptions>): HttpConfigOptions {
  return {
    httpProxy: undefined,
    httpsProxy: undefined,
    userAgent: undefined,
    ...loadConfigFromEnv(),
    ...options
  };
}
