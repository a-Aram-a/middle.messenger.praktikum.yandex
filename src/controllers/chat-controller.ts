import { chatAPI, type Chat, type GetChatsParams, type Message } from '@/app/api/chat-api';
import store from '@/core/store/store';
import { webSocketService } from '@/services/websocket-service';
import { type User } from '@/app/api/auth-api';

class ChatController {
  public async selectChat(chatId: number): Promise<void> {
    const chats = store.getState().chats as Chat[] | undefined;
    const chat = chats?.find(c => c.id === chatId);
    if (chat) {
      store.set('selectedChat', chat);
      store.set('messages', []);
      await this.connectToChat(chatId);
    }
  }

  private async connectToChat(chatId: number): Promise<void> {
    try {
      const user = store.getState().user as User;
      if (!user) return;

      const { token } = await chatAPI.getChatToken(chatId);

      webSocketService.disconnect();
      webSocketService.connect(user.id, chatId, token);

      webSocketService.onMessage((data) => {
        const messages = Array.isArray(data) ? data : [data];
        const currentMessages = (store.getState().messages as Message[]) || [];

        const newMessages = [...messages, ...currentMessages].sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
        );

        const uniqueMessages = newMessages.filter(
          (msg, index, self) => index === self.findIndex(m => m.id === msg.id),
        );

        store.set('messages', uniqueMessages);
      });
    } catch (e: any) {
      console.error('Failed to connect to chat:', e.reason || e.message);
    }
  }

  public sendMessage(content: string): void {
    webSocketService.sendMessage(content);
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
