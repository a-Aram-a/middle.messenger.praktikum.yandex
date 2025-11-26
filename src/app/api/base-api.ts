import { HTTPTransport } from '@/core/http-transport';
import { API_BASE_URL } from '@/core/constants';

export abstract class BaseAPI {
  protected http: HTTPTransport;

  protected constructor(endpoint: string) {
    this.http = new HTTPTransport(`${API_BASE_URL}${endpoint}`);
  }
}
