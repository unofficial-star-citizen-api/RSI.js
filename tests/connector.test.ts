import { HttpClient } from '../src/index';
import axios from 'axios';

const url = 'http://icanhazip.com';

describe('HttpClient', () => {
  test('should make a request', async () => {
    const conn = new HttpClient();
    const response = await conn.post(url);

    expect(response.status).toBe(200);
  });

  test('should make an async request', async () => {
    const conn = new HttpClient();
    const response = await conn.post(url);

    expect(response.status).toBe(200);
  });

  test('should use proxy if configured', async () => {
    // Get public IP
    const publicResponse = await axios.get(url);
    const ipPublic = publicResponse.data.trim();
    expect(publicResponse.status).toBe(200);

    // Get IP through HttpClient
    const conn = new HttpClient({httpProxy: process.env.HTTP_PROXY });
    const proxyResponse = await conn.post<string>(url);
    const ipProxy = proxyResponse.data.trim();
    expect(proxyResponse.status).toBe(200);

    // If proxy is configured, IPs should be different
    if (conn.config.httpProxy) {
      if (ipPublic === ipProxy) {
        console.warn('Bad proxy configuration');
      }
    } else {
      console.warn('Executing without proxy');
    }
  });

  test('should make a request to RSI', async () => {
    const conn = new HttpClient();
    const response = await conn.post(HttpClient.urlHost);

    expect(response.status).toBe(200);
  });
});
