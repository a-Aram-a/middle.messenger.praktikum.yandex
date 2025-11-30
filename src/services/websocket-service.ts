import { type Message } from '@/app/api/chat-api';

const WS_BASE_URL = 'wss://ya-praktikum.tech/ws/chats';
const PING_INTERVAL = 30000; // 30 seconds

type WSMessage =
  | { type: 'message'; content: string }
  | { type: 'get old'; content: string }
  | { type: 'ping' };

export class WebSocketService {
  private socket: WebSocket | null = null;

  private pingInterval: number | null = null;

  private messageHandlers: Array<(messages: Message | Message[]) => void> = [];

  public connect(userId: number, chatId: number, token: string): void {
    if (this.socket) {
      this.disconnect();
    }

    const url = `${WS_BASE_URL}/${userId}/${chatId}/${token}`;
    this.socket = new WebSocket(url);

    this.socket.addEventListener('open', () => {
      console.log('WebSocket connection established');
      this.startPing();
      this.getOldMessages(0);
    });

    this.socket.addEventListener('close', (event) => {
      console.log('WebSocket connection closed', event.code, event.reason);
      this.stopPing();
    });

    this.socket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'pong') {
          return;
        }

        if (data.type === 'user connected') {
          console.log('User connected:', data.content);
          return;
        }

        this.notifyMessageHandlers(data);
      } catch (e) {
        console.error('Failed to parse WebSocket message', e);
      }
    });

    this.socket.addEventListener('error', (event) => {
      console.error('WebSocket error', event);
      alert('Error: Failed to establish chat connection. Please check your internet connection and try again.');
    });
  }

  public disconnect(): void {
    this.stopPing();
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  public sendMessage(content: string): void {
    this.send({ type: 'message', content });
  }

  public getOldMessages(offset: number): void {
    this.send({ type: 'get old', content: String(offset) });
  }

  public onMessage(handler: (messages: Message | Message[]) => void): void {
    this.messageHandlers.push(handler);
  }

  public offMessage(handler: (messages: Message | Message[]) => void): void {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }

  private send(message: WSMessage): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  private startPing(): void {
    this.pingInterval = window.setInterval(() => {
      this.send({ type: 'ping' });
    }, PING_INTERVAL);
  }

  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private notifyMessageHandlers(data: Message | Message[]): void {
    this.messageHandlers.forEach(handler => handler(data));
  }
}

export const webSocketService = new WebSocketService();
