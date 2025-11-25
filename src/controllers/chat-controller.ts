import { chatAPI, type Chat, type GetChatsParams } from '@/app/api/chat-api';
import store from '@/core/store/store';

class ChatController {
  public selectChat(chatId: number): void {
    const chats = store.getState().chats as Chat[] | undefined;
    const chat = chats?.find(c => c.id === chatId);
    if (chat) {
      store.set('selectedChat', chat);
    }
  }

  public async getChats(params?: GetChatsParams): Promise<Chat[]> {
    try {
      const chats = await chatAPI.getChats(params);
      store.set('chats', chats);
      return chats;
    } catch (e: any) {
      console.error('Get chats failed:', e.reason || e.message);
      return [];
    }
  }

  public async createChat(title: string): Promise<number | null> {
    try {
      const { id } = await chatAPI.createChat(title);
      await this.getChats();
      return id;
    } catch (e: any) {
      console.error('Create chat failed:', e.reason || e.message);
      return null;
    }
  }

  public async deleteChat(chatId: number): Promise<boolean> {
    try {
      await chatAPI.deleteChat(chatId);
      await this.getChats();
      return true;
    } catch (e: any) {
      console.error('Delete chat failed:', e.reason || e.message);
      return false;
    }
  }

  public async addUserToChat(userId: number, chatId: number): Promise<boolean> {
    try {
      await chatAPI.addUsersToChat({ users: [userId], chatId });
      return true;
    } catch (e: any) {
      console.error('Add user to chat failed:', e.reason || e.message);
      return false;
    }
  }

  public async removeUserFromChat(userId: number, chatId: number): Promise<boolean> {
    try {
      await chatAPI.removeUsersFromChat({ users: [userId], chatId });
      return true;
    } catch (e: any) {
      console.error('Remove user from chat failed:', e.reason || e.message);
      return false;
    }
  }
}

export default new ChatController();
