import
{
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi
} from 'vitest';
import
{
  FundingGoals,
  Organizations,
  ProgressTrackers,
  Roadmaps,
  RSI,
  Ships,
  Starmaps,
  Telemetries,
  Users,
  Versions
} from '.';
import { Logger } from './logger';

describe('RSI', () =>
{
  let rsi: RSI;

  beforeEach(() =>
  {
    rsi = new RSI();
  });

  afterEach(() =>
  {
    Logger.enabled = false;
  });

  describe('Constructor', () =>
  {
    test('should create instance with default config', () =>
    {
      expect(rsi).toBeInstanceOf(RSI);
    });

    test('should create instance with custom config', () =>
    {
      const customRsi = new RSI({ httpConfig: { userAgent: 'CustomAgent' } });
      expect(customRsi).toBeInstanceOf(RSI);
      expect(customRsi.httpClient.config.userAgent).toBe('CustomAgent');
    });

    test('should apply httpProxy config option', () =>
    {
      const proxy = 'socks5://127.0.0.1:1080';
      const customRsi = new RSI({ httpConfig: { httpProxy: proxy } });
      expect(customRsi.httpClient.config.httpProxy).toBe(proxy);
    });

    test('should apply httpsProxy config option', () =>
    {
      const proxy = 'socks5://127.0.0.1:1080';
      const customRsi = new RSI({ httpConfig: { httpsProxy: proxy } });
      expect(customRsi.httpClient.config.httpsProxy).toBe(proxy);
    });

    test('should apply noProxy config option', () =>
    {
      const noProxy = 'localhost,127.0.0.1';
      const customRsi = new RSI({ httpConfig: { noProxy } });
      expect(customRsi.httpClient.config.noProxy).toBe(noProxy);
    });

    test('should apply logging config option', () =>
    {
      new RSI({ logging: true });
      expect(Logger.enabled).toBe(true);
    });

    test('should apply multiple config options at once', () =>
    {
      const config = {
        userAgent: 'CustomAgent',
        httpProxy: 'http://proxy:8080',
        httpsProxy: 'https://proxy:8443',
        noProxy: 'localhost'
      };
      const customRsi = new RSI({ httpConfig: config });

      expect(customRsi.httpClient.config.userAgent).toBe(config.userAgent);
      expect(customRsi.httpClient.config.httpProxy).toBe(config.httpProxy);
      expect(customRsi.httpClient.config.httpsProxy).toBe(config.httpsProxy);
      expect(customRsi.httpClient.config.noProxy).toBe(config.noProxy);
    });

    test('should initialize all public properties', () =>
    {
      expect(rsi.users).toBeInstanceOf(Users);
      expect(rsi.organizations).toBeInstanceOf(Organizations);
      expect(rsi.progressTrackers).toBeInstanceOf(ProgressTrackers);
      expect(rsi.roadmaps).toBeInstanceOf(Roadmaps);
      expect(rsi.ships).toBeInstanceOf(Ships);
      expect(rsi.starmaps).toBeInstanceOf(Starmaps);
      expect(rsi.fundingGoals).toBeInstanceOf(FundingGoals);
      expect(rsi.telemetries).toBeInstanceOf(Telemetries);
      expect(rsi.versions).toBeInstanceOf(Versions);
    });
  });

  describe('noProxy functionality', () =>
  {
    // This test exposes the private shouldUseProxy method for testing
    // via spying on the HTTP client
    test('should bypass proxy for URLs matching noProxy patterns', () =>
    {
      // Create RSI with proxy and noProxy settings
      const customRsi = new RSI({
        httpConfig: {
          httpProxy: 'http://proxy:8080',
          httpsProxy: 'https://proxy:8443',
          noProxy: 'localhost,example.com,.internal.domain,*.test.com'
        }
      });

      // Expose the private shouldUseProxy method to the test
      const httpClient = customRsi.httpClient as unknown as { shouldUseProxy(url: string): boolean };
      const shouldUseProxySpy = vi.spyOn(httpClient, 'shouldUseProxy');

      // Test with URLs that should bypass proxy

      expect(httpClient.shouldUseProxy('http://localhost/api')).toBe(false);

      expect(httpClient.shouldUseProxy('https://example.com/page')).toBe(false);

      expect(httpClient.shouldUseProxy('http://server.internal.domain/data')).toBe(false);

      expect(httpClient.shouldUseProxy('https://api.test.com/v1')).toBe(false);

      // Test with URLs that should use proxy

      expect(httpClient.shouldUseProxy('https://google.com')).toBe(true);

      expect(httpClient.shouldUseProxy('http://robertsspaceindustries.com')).toBe(true);

      expect(httpClient.shouldUseProxy('https://other.domain.com')).toBe(true);

      expect(shouldUseProxySpy).toHaveBeenCalledTimes(7);
      shouldUseProxySpy.mockRestore();
    });
  });
});
