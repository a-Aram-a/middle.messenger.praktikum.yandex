import './chat-item.scss';

import { Block, type Props } from '@/core/block';
import template from './chat-item.hbs?raw';

interface ChatItemProps extends Props {
  id: number;
  avatarUrl: string;
  name: string;
  lastMessageTime: string;
  lastMessageText: string;
  lastMessageSender?: string;
  unreadCount?: number;
  isActive?: boolean;
}

export class ChatItem extends Block<ChatItemProps> {
  constructor(props: ChatItemProps) {
    super({
      ...props,

      // TEMP: remove after implementing routing
      events: {
        click: (event: Event) => {
          event.preventDefault();
        },
      },
    });
  }

  render() {
    return template;
  }
}
