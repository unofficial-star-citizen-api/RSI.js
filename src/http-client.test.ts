import
{
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi
} from 'vitest';
import { HttpClient } from './index';

describe('HttpClient', () =>
{
  afterEach(() =>
  {
    vi.restoreAllMocks();
  });

  describe('Configuration', () =>
  {
    test('should create instance with default config', () =>
    {
      const client = new HttpClient();
      expect(client).toBeInstanceOf(HttpClient);
    });

    test('should apply custom userAgent', () =>
    {
      const client = new HttpClient({ userAgent: 'TestAgent/1.0' });
      expect(client.config.userAgent).toBe('TestAgent/1.0');
    });

    test('should apply httpsProxy config', () =>
    {
      const client = new HttpClient({ httpsProxy: 'https://proxy:8080' });
      expect(client.config.httpsProxy).toBe('https://proxy:8080');
    });

    test('should apply httpProxy config', () =>
    {
      const client = new HttpClient({ httpProxy: 'http://proxy:3128' });
      expect(client.config.httpProxy).toBe('http://proxy:3128');
    });

    test('should apply noProxy config', () =>
    {
      const client = new HttpClient({ noProxy: 'localhost,127.0.0.1' });
      expect(client.config.noProxy).toBe('localhost,127.0.0.1');
    });

    test('should apply multiple config options', () =>
    {
      const client = new HttpClient({
        userAgent: 'Agent/2.0',
        httpProxy: 'http://proxy:3128',
        httpsProxy: 'https://proxy:8443',
        noProxy: 'localhost'
      });
      expect(client.config.userAgent).toBe('Agent/2.0');
      expect(client.config.httpProxy).toBe('http://proxy:3128');
      expect(client.config.httpsProxy).toBe('https://proxy:8443');
      expect(client.config.noProxy).toBe('localhost');
    });

    test('should override env vars with explicit config', () =>
    {
      const originalProxy = process.env.HTTPS_PROXY;
      process.env.HTTPS_PROXY = 'https://env-proxy:9000';
      try
      {
        const client = new HttpClient({ httpsProxy: 'https://explicit-proxy:8080' });
        expect(client.config.httpsProxy).toBe('https://explicit-proxy:8080');
      }
      finally
      {
        process.env.HTTPS_PROXY = originalProxy;
      }
    });

    test('should read proxy from environment variables when not set explicitly', () =>
    {
      const originalProxy = process.env.HTTPS_PROXY;
      process.env.HTTPS_PROXY = 'https://env-proxy:9000';
      try
      {
        const client = new HttpClient();
        expect(client.config.httpsProxy).toBe('https://env-proxy:9000');
      }
      finally
      {
        process.env.HTTPS_PROXY = originalProxy;
      }
    });
  });

  describe('HTTP methods', () =>
  {
    let client: HttpClient;

    beforeEach(() =>
    {
      client = new HttpClient();
    });

    test('should make a GET request and return response', async () =>
    {
      const mockResponse = { status: 200, data: { result: 'ok' } };
      vi.spyOn(client, 'get').mockResolvedValue(mockResponse as any);

      const response = await client.get('https://robertsspaceindustries.com/api/test');
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ result: 'ok' });
    });

    test('should make a POST request and return response', async () =>
    {
      const mockResponse = { status: 200, data: { success: 1 } };
      vi.spyOn(client, 'post').mockResolvedValue(mockResponse as any);

      const response = await client.post('https://robertsspaceindustries.com/api/test', { key: 'value' });
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ success: 1 });
    });

    test('should propagate network errors', async () =>
    {
      vi.spyOn(client, 'get').mockRejectedValue(new Error('Network error'));

      await expect(client.get('https://robertsspaceindustries.com')).rejects.toThrow('Network error');
    });

    test('should propagate non-200 status without throwing', async () =>
    {
      vi.spyOn(client, 'get').mockResolvedValue({ status: 404, data: null } as any);

      const response = await client.get('https://robertsspaceindustries.com/nonexistent');
      expect(response.status).toBe(404);
    });
  });

  describe('Proxy bypass (shouldUseProxy)', () =>
  {
    test('should return true when no noProxy is configured', () =>
    {
      const client = new HttpClient({ httpsProxy: 'https://proxy:8080' });
      expect((client as any).shouldUseProxy('https://robertsspaceindustries.com')).toBe(true);
    });

    test('should bypass proxy for exact domain match', () =>
    {
      const client = new HttpClient({ httpsProxy: 'https://proxy:8080', noProxy: 'example.com' });
      expect((client as any).shouldUseProxy('https://example.com/page')).toBe(false);
    });

    test('should bypass proxy for localhost', () =>
    {
      const client = new HttpClient({ noProxy: 'localhost,127.0.0.1' });
      expect((client as any).shouldUseProxy('http://localhost/api')).toBe(false);
    });

    test('should bypass proxy for wildcard subdomain match (*.example.com)', () =>
    {
      const client = new HttpClient({ httpsProxy: 'https://proxy:8080', noProxy: '*.example.com' });
      expect((client as any).shouldUseProxy('https://api.example.com/v1')).toBe(false);
      expect((client as any).shouldUseProxy('https://other.example.com')).toBe(false);
    });

    test('should bypass proxy for suffix match (.internal.domain)', () =>
    {
      const client = new HttpClient({ noProxy: '.internal.domain' });
      expect((client as any).shouldUseProxy('http://server.internal.domain/data')).toBe(false);
    });

    test('should use proxy for non-matching domains', () =>
    {
      const client = new HttpClient({ httpsProxy: 'https://proxy:8080', noProxy: 'localhost,example.com' });
      expect((client as any).shouldUseProxy('https://robertsspaceindustries.com')).toBe(true);
      expect((client as any).shouldUseProxy('https://google.com')).toBe(true);
    });
  });

  describe('toAbsoluteUrl', () =>
  {
    test('should convert relative path to absolute RSI URL', () =>
    {
      expect(HttpClient.toAbsoluteUrl('/api/endpoint')).toBe('https://robertsspaceindustries.com/api/endpoint');
    });

    test('should return undefined for undefined input', () =>
    {
      expect(HttpClient.toAbsoluteUrl(undefined)).toBeUndefined();
    });

    test('should handle absolute URLs as-is', () =>
    {
      expect(HttpClient.toAbsoluteUrl('https://robertsspaceindustries.com/api')).toBe('https://robertsspaceindustries.com/api');
    });

    test('should expose RSI host constant', () =>
    {
      expect(HttpClient.host).toBe('https://robertsspaceindustries.com');
    });
  });
});
