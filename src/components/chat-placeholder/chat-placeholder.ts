import './chat-placeholder.scss';

import { Block, type Props } from '@/core/block';
import template from './chat-placeholder.hbs?raw';

interface ChatPlaceholderProps extends Props {
  text?: string;
}

export class ChatPlaceholder extends Block<ChatPlaceholderProps> {
  constructor(props: ChatPlaceholderProps = {}) {
    super({
      text: 'Select a chat to send a message',
      ...props,
    });
  }

  render() {
    return template;
  }
}
