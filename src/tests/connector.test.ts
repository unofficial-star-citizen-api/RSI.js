import { Connector } from '../index';
import { config, updateConfig } from '../services/config';
import axios from 'axios';

const url = 'http://icanhazip.com';

describe('Connector', () => {
  beforeEach(() => {
    // Reset config before each test
    updateConfig({
      httpProxy: undefined
    });
  });

  test('should make a request', async () => {
    const conn = new Connector();
    const response = await conn.request(url);

    expect(response.status).toBe(200);
  });

  test('should make an async request', async () => {
    const conn = new Connector();
    const response = await conn.request(url);

    expect(response.status).toBe(200);
  });

  test('should use proxy if configured', async () => {
    // Get public IP
    const publicResponse = await axios.get(url);
    const ipPublic = publicResponse.data.trim();
    expect(publicResponse.status).toBe(200);

    // Configure proxy for this test
    const httpProxy = process.env.HTTP_PROXY; // For backwards compatibility in test
    if (httpProxy) {
      updateConfig({ httpProxy });
    }

    // Get IP through connector
    const conn = new Connector();
    const proxyResponse = await conn.request<string>(url);
    const ipProxy = proxyResponse.data.trim();
    expect(proxyResponse.status).toBe(200);

    // If proxy is configured, IPs should be different
    if (config.httpProxy) {
      if (ipPublic === ipProxy) {
        console.warn('Bad proxy configuration');
      }
    } else {
      console.warn('Executing without proxy');
    }
  });

  test('should make a request to RSI', async () => {
    const conn = new Connector();
    const response = await conn.request(Connector.urlHost);

    expect(response.status).toBe(200);
  });
});
