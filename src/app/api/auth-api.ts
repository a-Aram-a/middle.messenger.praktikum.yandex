import { BaseAPI } from './base-api';

export type SignupData = {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
};

export type SigninData = {
  login: string;
  password: string;
};

export type User = {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string | null;
  phone: string;
  login: string;
  avatar: string | null;
  email: string;
};


class AuthAPI extends BaseAPI {
  constructor() {
    super('/auth');
  }

  private handleResponse<T>(xhr: XMLHttpRequest): Promise<T> {
    if (xhr.response === 'OK') {
      return Promise.resolve({} as T);
    }
    try {
      return Promise.resolve(JSON.parse(xhr.responseText));
    } catch (e) {
      return Promise.reject(new Error('Failed to parse JSON response'));
    }
  }

  private handleError(xhr: XMLHttpRequest): Promise<never> {
    let error;

    // Handle specific HTTP status codes
    if (xhr.status === 0) {
      error = new Error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    try {
      const response = JSON.parse(xhr.responseText);
      error = new Error(response.reason || `Request failed with status ${xhr.status}`);
      Object.assign(error, response);
    } catch (e) {
      error = new Error(`Request failed with status ${xhr.status}`);
    }
    return Promise.reject(error);
  }

  public signup(data: SignupData): Promise<{ id: number }> {
    return this.http.post('/signup', { data })
      .then(xhr => this.handleResponse<{ id: number }>(xhr))
      .catch(this.handleError);
  }

  public signin(data: SigninData): Promise<void> {
    return this.http.post('/signin', { data })
      .then(xhr => this.handleResponse<void>(xhr))
      .catch(this.handleError);
  }

  public getUser(): Promise<User> {
    return this.http.get('/user')
      .then(xhr => this.handleResponse<User>(xhr))
      .catch(this.handleError);
  }

  public logout(): Promise<void> {
    return this.http.post('/logout')
      .then(xhr => this.handleResponse<void>(xhr))
      .catch(this.handleError);
  }
}

export const authAPI = new AuthAPI();
