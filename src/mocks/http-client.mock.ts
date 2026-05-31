import
{
  AxiosError, AxiosInstance,
  AxiosResponse
} from 'axios';
import { HttpClient, HttpConfigOptions } from '../http-client';

type MockResponseMap = Map<string, {
  response?: AxiosResponse<any>;
  error?: AxiosError | Error;
}>;

/**
 * A mock implementation of HttpClient for testing purposes
 * This implementation preserves the interceptor functionality of the real HttpClient
 * but allows you to provide custom responses for specific URLs
 */
export class HttpClientMock extends HttpClient
{
  private mockResponseMap: MockResponseMap = new Map();
  private mockAxiosInstance: AxiosInstance;

  /**
   * Create a new HttpClientMock
   * @param config Optional configuration for the HttpClient
   */
  constructor(config?: Partial<HttpConfigOptions>)
  {
    super(config);

    // Override the axiosInstance with our mock
    this.mockAxiosInstance = this.createMockAxiosInstance();
    Object.defineProperty(this, 'axiosInstance', {
      get: () => this.mockAxiosInstance
    });
  }

  /**
   * Create a mock axios instance that preserves all the interceptor functionality
   * of the real HttpClient but allows custom responses
   */
  private createMockAxiosInstance(): AxiosInstance
  {
    // Create a real axios instance to preserve interceptors behavior
    const realInstance = this['axiosInstance'];

    // Override the request methods with mocked versions
    realInstance.get = this.createMockMethod('get');
    realInstance.post = this.createMockMethod('post');
    realInstance.put = this.createMockMethod('put');
    realInstance.delete = this.createMockMethod('delete');

    return realInstance;
  }

  /**
   * Create a mock method (get, post, put, delete) that will return the mocked response
   * if one is set, or throw the mocked error if one is set
   */
  private createMockMethod(methodName: 'get' | 'post' | 'put' | 'delete'): any
  {
    return (url: string): Promise<AxiosResponse<any>> =>
    {
      // Find a matching mock response
      const mockData = this.mockResponseMap.get(url);

      // If a mock response is found, return it or throw the error
      if (mockData)
      {
        if (mockData.error)
        {
          return Promise.reject(mockData.error);
        }
        if (mockData.response)
        {
          return Promise.resolve(mockData.response);
        }
      }

      // If no mock is found, throw an error
      return Promise.reject(new Error(`No mock defined for ${methodName.toUpperCase()} ${url}`));
    };
  }

  /**
   * Set a mock response for a specific URL
   * @param url The URL to mock
   * @param responseData The response data to return
   * @param status The HTTP status code (default: 200)
   */
  public mockResponse<T = any>(url: string, responseData: T, status = 200): void
  {
    this.mockResponseMap.set(url, {
      response: {
        data: responseData,
        status,
        statusText: status === 200 ? 'OK' : 'Error',
        headers: {},
        config: { url } as any
      }
    });
  }

  /**
   * Set a mock error for a specific URL
   * @param url The URL to mock
   * @param error The error to throw
   */
  public mockError(url: string, error: AxiosError | Error): void
  {
    this.mockResponseMap.set(url, { error });
  }

  /**
   * Clear all mock responses and errors
   */
  public clearMocks(): void
  {
    this.mockResponseMap.clear();
  }
}
