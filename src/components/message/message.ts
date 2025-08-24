import './message.scss';

import { Block, type Props } from '@/core/block';
import template from './message.hbs?raw';

interface MessageProps extends Props {
  text?: string;
  imageUrl?: string;
  timestamp: string;
  isIncoming: boolean;
}

export class Message extends Block<MessageProps> {
  constructor(props: MessageProps) {
    super({
      ...props,
      className: props.isIncoming ? 'message_incoming' : 'message_outgoing',
    });
  }

  render() {
    return template;
  }
}
