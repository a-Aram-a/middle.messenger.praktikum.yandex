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

export type Message = {
  id: number;
  user_id: number;
  chat_id: number;
  time: string;
  type: 'message' | 'file';
  content: string;
  file?: {
    id: number;
    user_id: number;
    path: string;
    filename: string;
    content_type: string;
    content_size: number;
    upload_date: string;
  };
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

    // Status 0 means network error (offline, CORS, blocked, etc.)
    if (xhr.status === 0) {
      error = new Error('Network error. Please check your internet connection.');
      return Promise.reject(error);
    }

    // Handle specific HTTP status codes
    if (xhr.status === 413) {
      error = new Error('File is too large. Please choose a smaller image.');
      return Promise.reject(error);
    }

    // Try to get error message from response
    try {
      const response = JSON.parse(xhr.responseText);
      error = new Error(response.reason || `Request failed with status ${xhr.status}`);
      Object.assign(error, response);
    } catch (e) {
      error = new Error(`Request failed with status ${xhr.status}`);
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

  public getChatToken(chatId: number): Promise<{ token: string }> {
    return this.http.post(`/token/${chatId}`)
      .then(xhr => this.handleResponse<{ token: string }>(xhr))
      .catch(this.handleError);
  }

  public updateChatAvatar(chatId: number, file: File): Promise<Chat> {
    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('chatId', String(chatId));
    return this.http.put('/avatar', { data: formData })
      .then(xhr => this.handleResponse<Chat>(xhr))
      .catch(this.handleError);
  }

  public getChatUsers(chatId: number): Promise<ChatUser[]> {
    return this.http.get(`/${chatId}/users`)
      .then(xhr => this.handleResponse<ChatUser[]>(xhr))
      .catch(this.handleError);
  }
}

export const chatAPI = new ChatAPI();
