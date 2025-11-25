import { BaseAPI } from './base-api';

export type ChatUser = {
  first_name: string;
  second_name: string;
  avatar: string | null;
  email: string;
  login: string;
  phone: string;
};

export type LastMessage = {
  user: ChatUser;
  time: string;
  content: string;
};

export type Chat = {
  id: number;
  title: string;
  avatar: string | null;
  unread_count: number;
  created_by: number;
  last_message: LastMessage | null;
};

export type GetChatsParams = {
  offset?: number;
  limit?: number;
  title?: string;
};

export type ChatUsersData = {
  users: number[];
  chatId: number;
};

class ChatAPI extends BaseAPI {
  constructor() {
    super('/chats');
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

  public getChats(params?: GetChatsParams): Promise<Chat[]> {
    return this.http.get('', { data: params })
      .then(xhr => this.handleResponse<Chat[]>(xhr))
      .catch(this.handleError);
  }

  public createChat(title: string): Promise<{ id: number }> {
    return this.http.post('', { data: { title } })
      .then(xhr => this.handleResponse<{ id: number }>(xhr))
      .catch(this.handleError);
  }

  public deleteChat(chatId: number): Promise<void> {
    return this.http.delete('', { data: { chatId } })
      .then(xhr => this.handleResponse<void>(xhr))
      .catch(this.handleError);
  }

  public addUsersToChat(data: ChatUsersData): Promise<void> {
    return this.http.put('/users', { data })
      .then(xhr => this.handleResponse<void>(xhr))
      .catch(this.handleError);
  }

  public removeUsersFromChat(data: ChatUsersData): Promise<void> {
    return this.http.delete('/users', { data })
      .then(xhr => this.handleResponse<void>(xhr))
      .catch(this.handleError);
  }
}

export const chatAPI = new ChatAPI();
