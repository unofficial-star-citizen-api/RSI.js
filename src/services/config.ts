/**
 * Configuration options for the RSI Scraper
 */
export interface ConfigOptions {
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
export function loadConfigFromEnv(): Partial<ConfigOptions> {
  const envConfig: Partial<ConfigOptions> = {};

  if (typeof process !== 'undefined' && process.env) {
    if (process.env.HTTP_PROXY) envConfig.httpProxy = process.env.HTTP_PROXY;
    if (process.env.USER_AGENT) envConfig.userAgent = process.env.USER_AGENT;
  }

  return envConfig;
}

/**
 * Default configuration values
 */
const defaultConfig: ConfigOptions = {
  httpProxy: undefined,
  userAgent: undefined
};

/**
 * The application configuration
 */
export const config: ConfigOptions = {
  ...defaultConfig,
  ...loadConfigFromEnv()
};

/**
 * Update the configuration with custom values
 * @param options - Configuration options to merge
 */
export function updateConfig(options: Partial<ConfigOptions>): void {
  Object.assign(config, options);
}
