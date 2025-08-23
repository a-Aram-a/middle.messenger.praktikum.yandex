import './chat-list.scss';

import {Block, type Props} from '@/core/block';
import {ChatItem} from '@/components/chat-item';
import template from './chat-list.hbs?raw';

interface ChatListProps extends Props {
    chats: ChatItem[];
}

export class ChatList extends Block<ChatListProps> {
    constructor(props: ChatListProps) {
        super(props);
    }

    render() {
        return template;
    }
}
