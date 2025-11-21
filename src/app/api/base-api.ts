import {HTTPTransport} from '@/core/http-transport';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://ya-praktikum.tech/api/v2';

export abstract class BaseAPI {
  protected http: HTTPTransport;

  protected constructor(endpoint: string) {
    this.http = new HTTPTransport(`${API_BASE_URL}${endpoint}`);
  }
}
