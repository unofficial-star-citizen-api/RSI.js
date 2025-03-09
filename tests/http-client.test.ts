import axios from 'axios';
import { HttpClient } from '../src/index';

const url = 'http://ipv4.icanhazip.com';

describe('HttpClient', () =>
{
  test('should make a request', async () =>
  {
    const conn = new HttpClient();
    const response = await conn.post(url);

    expect(response.status).toBe(200);
  });

  test('should make an async request', async () =>
  {
    const conn = new HttpClient();
    const response = await conn.post(url);

    expect(response.status).toBe(200);
  });

  test('should use proxy if configured', async () =>
  {
    // Get public IP without proxy using a direct axios instance
    const axiosInstance = axios.create();
    const publicResponse = await axiosInstance.get(url);
    const ipPublic = publicResponse.data.trim();
    expect(publicResponse.status).toBe(200);

    // Get IP through HttpClient with proxy
    const conn = new HttpClient({ httpsProxy: process.env.HTTPS_PROXY });
    const proxyResponse = await conn.post<string>(url);
    const ipProxy = proxyResponse.data.trim();
    expect(proxyResponse.status).toBe(200);

    // If proxy is configured, IPs should be different
    if (conn.config.httpsProxy)
    {
      expect(ipPublic).not.toBe(ipProxy);
    } else
    {
      console.warn('Executing without proxy');
      expect(ipPublic).toBe(ipProxy);
    }
  });

  test('should make a request to RSI', async () =>
  {
    const conn = new HttpClient();
    const response = await conn.post(HttpClient.host);

    expect(response.status).toBe(200);
  });
});
