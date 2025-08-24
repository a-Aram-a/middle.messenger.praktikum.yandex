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


class AuthAPI extends BaseAPI {
  constructor() {
    super('/auth');
  }

  public signup(data: SignupData): Promise<XMLHttpRequest> {
    return this.http.post('/signup', { data });
  }

  public signin(data: SigninData): Promise<XMLHttpRequest> {
    return this.http.post('/signin', { data });
  }

  public getUser(): Promise<XMLHttpRequest> {
    return this.http.get('/user');
  }

  public logout(): Promise<XMLHttpRequest> {
    return this.http.post('/logout');
  }
}

export const authAPI = new AuthAPI();
