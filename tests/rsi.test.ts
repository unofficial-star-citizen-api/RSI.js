import {
  Organization,
  ProgressTracker,
  Roadmap,
  RSI,
  Ship,
  Starmap,
  Stats,
  Telemetry,
  User,
  TelemetryVersion
} from '../src';

describe('RSI', () => {
  let rsi: RSI;

  beforeEach(() => {
    rsi = new RSI();
  });

  describe('Constructor', () => {
    test('should create instance with default config', () => {
      expect(rsi).toBeInstanceOf(RSI);
    });

    test('should create instance with custom config', () => {
      const customRsi = new RSI({ httpConfig: { userAgent: 'CustomAgent' } });
      expect(customRsi).toBeInstanceOf(RSI);
      expect(customRsi.httpClient.config.userAgent).toBe('CustomAgent');
    });

    test('should apply httpProxy config option', () => {
      const proxy = 'socks5://127.0.0.1:1080';
      const customRsi = new RSI({ httpConfig: { httpProxy: proxy } });
      expect(customRsi.httpClient.config.httpProxy).toBe(proxy);
    });

    test('should apply httpsProxy config option', () => {
      const proxy = 'socks5://127.0.0.1:1080';
      const customRsi = new RSI({ httpConfig: { httpsProxy: proxy } });
      expect(customRsi.httpClient.config.httpsProxy).toBe(proxy);
    });

    test('should apply noProxy config option', () => {
      const noProxy = 'localhost,127.0.0.1';
      const customRsi = new RSI({ httpConfig: { noProxy } });
      expect(customRsi.httpClient.config.noProxy).toBe(noProxy);
    });

    test('should apply multiple config options at once', () => {
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

    test('should initialize all public properties', () => {
      expect(rsi.user).toBeInstanceOf(User);
      expect(rsi.organization).toBeInstanceOf(Organization);
      expect(rsi.progressTracker).toBeInstanceOf(ProgressTracker);
      expect(rsi.roadmap).toBeInstanceOf(Roadmap);
      expect(rsi.ships).toBeInstanceOf(Ship);
      expect(rsi.starmap).toBeInstanceOf(Starmap);
      expect(rsi.stats).toBeInstanceOf(Stats);
      expect(rsi.telemetry).toBeInstanceOf(Telemetry);
      expect(rsi.version).toBeInstanceOf(Version);
    });
  });

  describe('noProxy functionality', () => {
    // This test exposes the private shouldUseProxy method for testing
    // via spying on the HTTP client
    test('should bypass proxy for URLs matching noProxy patterns', () => {
      // Create RSI with proxy and noProxy settings
      const customRsi = new RSI({
        httpConfig: {
          httpProxy: 'http://proxy:8080',
          httpsProxy: 'https://proxy:8443',
          noProxy: 'localhost,example.com,.internal.domain,*.test.com'
        }
      });

      // Get access to the HTTP client instance
      const httpClient = customRsi.httpClient;

      // Create spy on the private shouldUseProxy method
      const shouldUseProxySpy = jest.spyOn(
        // @ts-ignore - Accessing private method for testing
        httpClient as any,
        'shouldUseProxy'
      );

      // Test with URLs that should bypass proxy
      // @ts-ignore - Direct call to private method for testing
      expect(httpClient.shouldUseProxy('http://localhost/api')).toBe(false);
      // @ts-ignore - Direct call to private method for testing
      expect(httpClient.shouldUseProxy('https://example.com/page')).toBe(false);
      // @ts-ignore - Direct call to private method for testing
      expect(httpClient.shouldUseProxy('http://server.internal.domain/data')).toBe(false);
      // @ts-ignore - Direct call to private method for testing
      expect(httpClient.shouldUseProxy('https://api.test.com/v1')).toBe(false);

      // Test with URLs that should use proxy
      // @ts-ignore - Direct call to private method for testing
      expect(httpClient.shouldUseProxy('https://google.com')).toBe(true);
      // @ts-ignore - Direct call to private method for testing
      expect(httpClient.shouldUseProxy('http://robertsspaceindustries.com')).toBe(true);
      // @ts-ignore - Direct call to private method for testing
      expect(httpClient.shouldUseProxy('https://other.domain.com')).toBe(true);

      // Restore the spy
      shouldUseProxySpy.mockRestore();
    });
  });
});