import './chat-item.scss';

import { Block, type Props } from '@/core/block';
import template from './chat-item.hbs?raw';
import chatController from '@/controllers/chat-controller';

interface ChatItemProps extends Props {
  id: number;
  avatarUrl: string;
  name: string;
  lastMessageTime: string;
  lastMessageText: string;
  lastMessageSender?: string;
  unreadCount?: number;
  isActive?: boolean;
  onSelect?: (id: number) => void;
}

export class ChatItem extends Block<ChatItemProps> {
  constructor(props: ChatItemProps) {
    super({
      ...props,
      events: {
        click: () => {
          chatController.selectChat(props.id);
          if (props.onSelect) {
            props.onSelect(props.id);
          }
        },
      },
    });
  }

  render() {
    return template;
  }
}
