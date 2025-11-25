import { BaseAPI } from './base-api';
import { type User } from './auth-api';

export type ProfileData = {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
};

export type PasswordData = {
  oldPassword: string;
  newPassword: string;
};

class UserAPI extends BaseAPI {
  constructor() {
    super('/user');
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
    try {
      const response = JSON.parse(xhr.responseText);
      error = new Error(response.reason || `HTTP error! Status: ${xhr.status}`);
      Object.assign(error, response);
    } catch (e) {
      error = new Error(`HTTP error! Status: ${xhr.status}`);
    }
    return Promise.reject(error);
  }

  public updateProfile(data: ProfileData): Promise<User> {
    return this.http.put('/profile', { data })
      .then(xhr => this.handleResponse<User>(xhr))
      .catch(this.handleError);
  }

  public updateAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.put('/profile/avatar', { data: formData })
      .then(xhr => this.handleResponse<User>(xhr))
      .catch(this.handleError);
  }

  public updatePassword(data: PasswordData): Promise<void> {
    return this.http.put('/password', { data })
      .then(xhr => this.handleResponse<void>(xhr))
      .catch(this.handleError);
  }

  public searchUsers(login: string): Promise<User[]> {
    return this.http.post('/search', { data: { login } })
      .then(xhr => this.handleResponse<User[]>(xhr))
      .catch(this.handleError);
  }
}

export const userAPI = new UserAPI();
