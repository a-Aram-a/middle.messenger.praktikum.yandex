export enum Method {
  Get = 'Get',
  Post = 'Post',
  Put = 'Put',
  Delete = 'Delete',
}

type Options = {
  method: Method;
  headers?: Record<string, string>;
  // The request body can be of any type (JSON object, FormData, etc.).
  // The responsibility for its format lies with the calling code (at the API services level).
  data?: any;
  timeout?: number;
};


function queryStringify(data: Record<string, string | number | boolean>): string {
  if (typeof data !== 'object' || data === null) {
    return '';
  }
  return '?' + Object.entries(data).map(([key, value]) => `${key}=${value}`).join('&');
}

export class HTTPTransport {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public get = (endpoint: string, options: Omit<Options, 'method'> = {}): Promise<XMLHttpRequest> => {
    const url = this.baseUrl + (options.data ? endpoint + queryStringify(options.data) : endpoint);
    return this.request(url, { ...options, method: Method.Get }, options.timeout);
  };

  public put = (endpoint: string, options: Omit<Options, 'method'> = {}): Promise<XMLHttpRequest> => {
    return this.request(this.baseUrl + endpoint, { ...options, method: Method.Put }, options.timeout);
  };

  public post = (endpoint: string, options: Omit<Options, 'method'> = {}): Promise<XMLHttpRequest> => {
    return this.request(this.baseUrl + endpoint, { ...options, method: Method.Post }, options.timeout);
  };

  public delete = (endpoint: string, options: Omit<Options, 'method'> = {}): Promise<XMLHttpRequest> => {
    return this.request(this.baseUrl + endpoint, { ...options, method: Method.Delete }, options.timeout);
  };

  private request = (url: string, options: Options, timeout = 5000): Promise<XMLHttpRequest> => {
    const { method, data, headers = {} } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);

      xhr.withCredentials = true;

      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.timeout = timeout;

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr);
        } else {
          // Reject with the xhr object so we can access status and responseText
          reject(xhr);
        }
      };
      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.ontimeout = () => reject(new Error('Request timed out'));

      if (method === Method.Get || !data) {
        xhr.send();
      } else if (data instanceof FormData) {
        xhr.send(data);
      } else {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
      }
    });
  };
}
